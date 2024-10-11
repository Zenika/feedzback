import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { environment } from '../../environments/environment';
import { LanguageService } from '../shared/i18n/language';
import { MessageComponent } from '../shared/message';
import { StatsDetailsComponent } from './stats-details/stats-details.component';
import { StatsSummaryComponent } from './stats-summary/stats-summary.component';
import { FeedbackPeriod, FeedbackStats, FeedbackStatsData } from './stats.types';

@Component({
  selector: 'app-stats',
  host: {
    '[attr.lang]': "'en'", // NOTE: this page is only available in english
  },
  standalone: true,
  imports: [MatIconModule, MatTabsModule, MessageComponent, StatsDetailsComponent, StatsSummaryComponent],
  templateUrl: './stats.component.html',
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

  // ----- Summary -----

  protected summary = computed(() => this.data().summary);

  protected summaryPeriod = computed<FeedbackPeriod>(() => {
    const { details } = this.data();
    return {
      start: details[0]?.month || null,
      end: details[details.length - 1]?.month || null,
    };
  });

  // ----- Details -----

  protected detailsLength = computed(() => this.data().details.length);

  protected detailsStart = signal(0);

  protected detailsEndFactory = computed(() => signal(this.detailsLength()));

  protected details = computed(() => this.data().details.slice(this.detailsStart(), this.detailsEndFactory()()));

  protected detailsPeriod = computed<FeedbackPeriod>(() => {
    const details = this.details();
    return {
      start: details[0]?.month || null,
      end: details[details.length - 1]?.month || null,
    };
  });
}
