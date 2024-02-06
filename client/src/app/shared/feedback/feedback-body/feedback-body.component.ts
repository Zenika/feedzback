import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MultiLineComponent } from '../../ui/multi-line/multi-line.component';
import { Feedback, FeedbackRequest, FeedbackType } from '../feedback.types';

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
  @Input({ required: true }) feedback!: Feedback | FeedbackRequest;

  protected feedbackType = FeedbackType;
}
