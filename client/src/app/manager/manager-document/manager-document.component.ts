import { DatePipe } from '@angular/common';
import { Component, ViewEncapsulation, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FeedbackBodyComponent, FeedbackTypeIconPipe } from '../../shared/feedback';
import { Feedback, FeedbackRequest } from '../../shared/feedback/feedback.types';
import { ManagerDocumentData } from './manager-document.types';

@Component({
  selector: 'app-manager-document',
  imports: [DatePipe, RouterLink, MatIconModule, FeedbackBodyComponent, FeedbackTypeIconPipe],
  templateUrl: './manager-document.component.html',
  encapsulation: ViewEncapsulation.None,
})
export default class ManagerDocumentComponent implements ManagerDocumentData {
  document = input.required<Feedback | FeedbackRequest>();

  protected hasBeenRequestedAgain = computed(() => this.document().updatedAt > this.document().createdAt);
}
