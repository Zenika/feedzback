import { Component, ViewEncapsulation, input } from '@angular/core';
import { Feedback, FeedbackRequest, FeedbackType } from '../feedback.types';
import { MultiLineComponent } from './multi-line';

@Component({
  selector: 'app-feedback-body',
  host: { class: 'app-feedback-body' },
  standalone: true,
  imports: [MultiLineComponent],
  templateUrl: './feedback-body.component.html',
  styleUrl: './feedback-body.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class FeedbackBodyComponent {
  feedback = input.required<Feedback | FeedbackRequest>();

  protected feedbackType = FeedbackType;
}
