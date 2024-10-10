import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective, provideEcharts, ThemeOption } from 'ngx-echarts';
import { environment } from '../../environments/environment';
import { LanguageService } from '../shared/i18n/language';
import { MessageComponent } from '../shared/message';
import { ThemeService } from '../shared/theme';
import { FeedbackHistoryStats, FeedbackStats } from './stats.types';
import { pluckMonthHistoryStats } from './stats.utils';

// Note: the different chart colors are taken from:
//    https://m2.material.io/design/color/the-color-system.html#tools-for-picking-colors

@Component({
  selector: 'app-stats',
  host: {
    class: 'app-stats',
    '[attr.lang]': "'en'", // NOTE: this page is only available in english
  },
  standalone: true,
  providers: [provideEcharts()],
  imports: [
    MatIconModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatTableModule,
    MatTabsModule,
    NgxEchartsDirective,
    MessageComponent,
  ],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export default class StatsComponent implements OnInit {
  protected status = signal<undefined | 'fetching' | 'noDataYet' | 'fetched'>(undefined);

  protected stats = signal<FeedbackStats>({
    summary: {} as FeedbackHistoryStats,
    details: [],
  });

  private httpClient = inject(HttpClient);

  protected fetch() {
    if (this.status() !== undefined) {
      this.status.set('fetching');
    }
    this.httpClient.get<FeedbackStats>(`${environment.apiBaseUrl}/feedback-stats`).subscribe((stats) => {
      const hasData = stats.details.length > 0;
      this.status.set(hasData ? 'fetched' : 'noDataYet');
      if (hasData) {
        this.stats.set(stats);
      }
    });
  }

  ngOnInit() {
    this.fetch();
  }

  protected period = computed(() => {
    const { details } = this.stats();
    return {
      start: details[0]?.month || null,
      end: details[details.length - 1]?.month || null,
    };
  });

  protected start = signal(0);

  protected endFactory = computed(() => signal(this.stats().details.length));

  private detailsPlucked = computed(() =>
    pluckMonthHistoryStats(this.stats().details.slice(this.start(), this.endFactory()())),
  );

  protected periodPluked = computed(() => {
    const { month } = this.detailsPlucked();
    return {
      start: month[0] || null,
      end: month[month.length - 1] || null,
    };
  });

  protected usersOverviewChartOptions = computed((): EChartsOption => {
    const plucked = this.detailsPlucked();

    return {
      backgroundColor: 'transparent',
      legend: {
        itemGap: 36,
      },
      tooltip: {},
      xAxis: {
        type: 'category',
        data: plucked.month,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'All',
          data: plucked.uniqueUsers,
          type: 'line',
          color: '#80DEEA', // Cyan
        },
        {
          name: 'Givers or receivers',
          data: plucked.uniqueGiversOrReceivers,
          type: 'bar',
          color: '#BA68C8', // Purple
        },
        {
          name: 'Requesters',
          data: plucked.uniqueRequesters,
          type: 'bar',
          color: '#FFA72680', // Orange 80%
        },
      ],
    };
  });

  protected giversAndReceiversChartOptions = computed((): EChartsOption => {
    const plucked = this.detailsPlucked();

    return {
      backgroundColor: 'transparent',
      legend: {
        itemGap: 36,
      },
      tooltip: {},
      xAxis: {
        type: 'category',
        data: plucked.month,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'Givers or receivers',
          data: plucked.uniqueGiversOrReceivers,
          type: 'line',
          color: '#BA68C8', // Purple
        },
        {
          name: 'Givers',
          data: plucked.uniqueGivers,
          type: 'bar',
          color: '#64B5F6', // Blue
        },
        {
          name: 'Receivers',
          data: plucked.uniqueReceivers,
          type: 'bar',
          color: '#F06292', // Pink
        },
      ],
    };
  });

  protected feedbacksChartOptions = computed((): EChartsOption => {
    const plucked = this.detailsPlucked();

    return {
      backgroundColor: 'transparent',
      legend: {
        itemGap: 36,
      },
      tooltip: {},
      xAxis: {
        type: 'category',
        data: plucked.month,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'Spontaneous',
          data: plucked.spontaneousFeedback,
          type: 'bar',
          stack: 'counts',
          color: '#81C784', // Green
        },
        {
          name: 'Replied',
          data: plucked.requestedFeedbackDone,
          type: 'bar',
          stack: 'counts',
          color: '#FFA726', // Orange
        },
        {
          name: 'Requested',
          data: plucked.requestedFeedbackPending,
          type: 'bar',
          stack: 'counts',
          color: '#FFA72685', // Orange 80%
        },
      ],
    };
  });

  private theme = inject(ThemeService).theme;

  protected chartTheme = computed((): ThemeOption | string | null => (this.theme() === 'dark' ? 'dark' : null));

  protected showLegend = signal(false);

  protected toggleLegend() {
    this.showLegend.update((show) => !show);
  }

  protected isFrenchLocale = inject(LanguageService).localeId === 'fr';

  private document = inject(DOCUMENT);

  protected reloadPage() {
    this.document.location.reload();
  }
}
