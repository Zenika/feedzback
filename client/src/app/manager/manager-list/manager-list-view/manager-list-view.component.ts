import { JsonPipe } from '@angular/common';
import { Component, ViewEncapsulation, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FeedbackItem, FeedbackRequestItem } from '../../../shared/feedback/feedback.types';

@Component({
  selector: 'app-manager-list-view',
  standalone: true,
  imports: [JsonPipe, RouterLink],
  templateUrl: './manager-list-view.component.html',
  styleUrl: './manager-list-view.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ManagerListViewComponent {
  items = input.required<(FeedbackItem | FeedbackRequestItem)[]>();
}
