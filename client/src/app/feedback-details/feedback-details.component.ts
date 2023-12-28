import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { DoneFeedbackComponent } from '../shared/feedback/done-feedback/done-feedback.component';
import { PendingFeedbackComponent } from '../shared/feedback/pending-feedback/pending-feedback.component';
import { FeedbackDetails } from './feedback-details.types';

@Component({
  selector: 'app-feedback-details',
  standalone: true,
  imports: [RouterLink, MatIconModule, DoneFeedbackComponent, PendingFeedbackComponent],
  templateUrl: './feedback-details.component.html',
  encapsulation: ViewEncapsulation.None,
})
export default class FeedbackDetailsComponent {
  @Input({ required: true }) feedbackDetails!: FeedbackDetails;
}
