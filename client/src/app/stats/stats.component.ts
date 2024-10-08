import { Component, computed, inject, input, signal, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective, provideEcharts, ThemeOption } from 'ngx-echarts';
import { ThemeService } from '../shared/theme';
import { FeedbackStats } from './stats.types';
import { pluckMonthHistoryStats } from './stats.utils';

@Component({
  selector: 'app-stats',
  host: { class: 'app-stats' },
  standalone: true,
  providers: [provideEcharts()],
  imports: [MatIconModule, MatSlideToggleModule, MatSliderModule, MatTableModule, MatTabsModule, NgxEchartsDirective],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export default class StatsComponent {
  stats = input.required<FeedbackStats>();

  protected start = signal(0);

  protected endFactory = computed(() => signal(this.stats().details.length));

  private detailsPlucked = computed(() =>
    pluckMonthHistoryStats(this.stats().details.slice(this.start(), this.endFactory()())),
  );

  protected period = computed(() => {
    const { month } = this.detailsPlucked();
    return {
      start: month[0],
      end: month[month.length - 1],
    };
  });

  protected usersChartOptions = computed((): EChartsOption => {
    const plucked = this.detailsPlucked();

    return {
      backgroundColor: 'transparent',
      legend: {
        itemGap: 24,
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
          type: 'bar',
        },
        {
          name: 'Givers or receivers',
          data: plucked.uniqueGiversOrReceivers,
          type: 'bar',
        },
        {
          name: 'Givers',
          data: plucked.uniqueGivers,
          type: 'bar',
          stack: 'counts',
        },
        {
          name: 'Receivers',
          data: plucked.uniqueReceivers,
          type: 'bar',
          stack: 'counts',
        },
        {
          name: 'Requeters',
          data: plucked.uniqueRequesters,
          type: 'bar',
          stack: 'counts',
        },
      ],
    };
  });

  protected feedbacksChartOptions = computed((): EChartsOption => {
    const plucked = this.detailsPlucked();

    return {
      backgroundColor: 'transparent',
      legend: {
        itemGap: 24,
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
        },
        {
          name: 'Requested (done)',
          data: plucked.requestedFeedbackDone,
          type: 'bar',
          stack: 'counts',
        },
        {
          name: 'Requested (pending)',
          data: plucked.requestedFeedbackPending,
          type: 'bar',
          stack: 'counts',
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
}
