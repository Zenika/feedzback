import { Component, ViewEncapsulation, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { DoneFeedbackComponent, PendingFeedbackComponent } from '../shared/feedback';
import { FeedbackDetails } from './feedback-details.types';

@Component({
  selector: 'app-feedback-details',
  standalone: true,
  imports: [RouterLink, MatIconModule, DoneFeedbackComponent, PendingFeedbackComponent],
  templateUrl: './feedback-details.component.html',
  encapsulation: ViewEncapsulation.None,
})
export default class FeedbackDetailsComponent {
  feedbackDetails = input.required<FeedbackDetails>();
}
