import { JsonPipe } from '@angular/common';
import { Component, ViewEncapsulation, input } from '@angular/core';
import { FeedbackItem, FeedbackRequestItem } from '../../shared/feedback/feedback.types';

@Component({
  selector: 'app-manager-feedback-list',
  host: { class: 'app-manager-feedback-list' },
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './manager-feedback-list.component.html',
  styleUrl: './manager-feedback-list.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ManagerFeedbackListComponent {
  items = input.required<(FeedbackItem | FeedbackRequestItem)[]>();
}
