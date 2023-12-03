import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FeedbackComponent } from '../shared/ui/feedback/feedback.component';
import { getFeedbackType } from '../shared/ui/feedback/feedback.helpers';
import { FeedbackType } from '../shared/ui/feedback/feedback.types';

@Component({
  selector: 'app-feedback-details',
  standalone: true,
  imports: [RouterLink, MatIconModule, FeedbackComponent],
  templateUrl: './feedback-details.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class FeedbackDetailsComponent {
  @Input({
    required: true,
    transform: (value: string) => getFeedbackType(value),
  })
  type?: FeedbackType;

  @Input({ required: true }) id!: string;

  protected feedbackType = FeedbackType;
}
