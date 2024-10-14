import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { environment } from '../../environments/environment';
import { LanguageService } from '../shared/i18n/language';
import { MessageComponent } from '../shared/message';
import { StatsDetailsComponent } from './stats-details/stats-details.component';
import { StatsSummaryComponent } from './stats-summary/stats-summary.component';
import { FeedbackPeriod, FeedbackStats, FeedbackStatsData } from './stats.types';
import { formatMonth } from './stats.utils';

@Component({
  selector: 'app-stats',
  host: {
    class: 'app-stats',
    '[attr.lang]': "'en'", // NOTE: this page is only available in english
  },
  standalone: true,
  imports: [
    MatIconModule,
    MatSliderModule,
    MatTabsModule,
    MessageComponent,
    StatsDetailsComponent,
    StatsSummaryComponent,
  ],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export default class StatsComponent implements OnInit {
  protected isFrenchLocale = inject(LanguageService).localeId === 'fr';

  protected status = signal<undefined | 'fetching' | 'noDataYet' | 'fetched'>(undefined);

  protected sentimentIcons = [
    'sentiment_neutral',
    'sentiment_dissatisfied',
    'sentiment_very_dissatisfied',
    'sentiment_extremely_dissatisfied',
  ];

  protected sentimentIconsIndex = signal(-1);

  protected increaseSentiment() {
    this.sentimentIconsIndex.update((index) => (index + 1) % this.sentimentIcons.length);
  }

  protected data = signal<FeedbackStatsData>({
    summary: {} as FeedbackStats,
    details: [],
  });

  private httpClient = inject(HttpClient);

  protected fetch() {
    if (this.status() !== undefined) {
      this.status.set('fetching');
    }
    this.httpClient.get<FeedbackStatsData>(`${environment.apiBaseUrl}/feedback-stats`).subscribe((data) => {
      const hasData = data.details.length > 0;
      this.status.set(hasData ? 'fetched' : 'noDataYet');
      if (hasData) {
        this.data.set(data);
      } else {
        this.increaseSentiment();
      }
    });
  }

  ngOnInit() {
    this.fetch();
  }

  private formattedMonths = computed(() =>
    this.data()
      .details.map(({ month }) => month)
      .map((value) => formatMonth(value)),
  );

  // ----- Summary -----

  protected summary = computed(() => this.data().summary);

  protected summaryPeriod = computed<FeedbackPeriod>(() => {
    const formattedMonths = this.formattedMonths();
    return {
      start: formattedMonths[0].long,
      end: formattedMonths[formattedMonths.length - 1].long,
    };
  });

  // ----- Slider (filtering details) -----

  protected sliderValue = (index: number) => this.formattedMonths()[index].short;

  protected sliderMax = computed(() => {
    const { length } = this.data().details;
    return length ? length - 1 : 0;
  });

  protected sliderStart = signal(0);

  protected sliderEndBuilder = computed(() => signal(this.sliderMax()));

  // ----- Details -----

  protected details = computed(() => this.data().details.slice(this.sliderStart(), this.sliderEndBuilder()() + 1));

  protected detailsPeriod = computed<FeedbackPeriod>(() => {
    const formattedMonths = this.formattedMonths();
    return {
      start: formattedMonths[this.sliderStart()].long,
      end: formattedMonths[this.sliderEndBuilder()()].long,
    };
  });
}
