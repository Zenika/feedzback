import { Component, ViewEncapsulation, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SENTIMENTS_DESC } from '../../../shared/ui/sentiment';
import { AllReviewStats } from '../../review.types';

@Component({
  selector: 'app-review-stats',
  host: { class: 'app-review-stats' },
  standalone: true,
  imports: [MatIconModule, MatTooltipModule],
  templateUrl: './review-stats.component.html',
  styleUrl: './review-stats.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ReviewStatsComponent {
  stats = input.required<AllReviewStats>();

  protected sentiments = SENTIMENTS_DESC;
}
