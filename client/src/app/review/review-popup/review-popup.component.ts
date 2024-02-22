import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { Component, ViewEncapsulation, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AllReviewStats } from '../review.types';
import { ReviewStatsComponent } from './review-stats/review-stats.component';

@Component({
  selector: 'app-review-popup',
  standalone: true,
  imports: [ReviewStatsComponent, OverlayModule, MatButtonModule, MatIconModule],
  templateUrl: './review-popup.component.html',
  styleUrl: './review-popup.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ReviewPopupComponent {
  stats = input.required<AllReviewStats>();

  protected readonly overlayPositions: ConnectedPosition[] = [
    { offsetY: 16, originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top' },
    { offsetY: -16, originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom' },
  ];

  protected overlayOpened = signal(false);
}
