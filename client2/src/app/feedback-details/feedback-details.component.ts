import { NgIf } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FeedbackComponent } from '../shared/feedback/feedback.component';
import { getFeedbackType } from '../shared/feedback/feedback.helpers';
import { FeedbackType } from '../shared/feedback/feedback.types';

@Component({
  selector: 'app-feedback-details',
  standalone: true,
  imports: [NgIf, RouterLink, MatIconModule, FeedbackComponent],
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
