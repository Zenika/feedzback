import { Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MultiLineComponent } from '../../ui/multi-line/multi-line.component';
import { Feedback, FeedbackRequest, FeedbackType } from '../feedback.types';

@Component({
  selector: 'app-feedback-body',
  standalone: true,
  imports: [MatIconModule, MultiLineComponent],
  templateUrl: './feedback-body.component.html',
  styleUrl: './feedback-body.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class FeedbackBodyComponent {
  @HostBinding('class.app-feedback-body') hasCss = true;

  @Input({ required: true }) feedback!: Feedback | FeedbackRequest;

  protected feedbackType = FeedbackType;
}
