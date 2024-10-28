import { Component, input, signal, ViewEncapsulation } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FeedbackStats, FeedbackStatsPeriod } from '../stats.types';

@Component({
  selector: 'app-stats-summary',
  host: { class: 'app-stats-summary' },
  standalone: true,
  imports: [MatSlideToggleModule],
  templateUrl: './stats-summary.component.html',
  styleUrl: './stats-summary.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class StatsSummaryComponent {
  summary = input.required<FeedbackStats>();

  period = input.required<FeedbackStatsPeriod>();

  protected showLegend = signal(false);

  protected toggleLegend() {
    this.showLegend.update((show) => !show);
  }
}
