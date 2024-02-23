import { DatePipe } from '@angular/common';
import { Component, ViewEncapsulation, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FeedbackBodyComponent } from '../../shared/feedback/feedback-body/feedback-body.component';
import { FeedbackTypeIconPipe } from '../../shared/feedback/feedback-type-icon.pipe';
import { Feedback, FeedbackRequest } from '../../shared/feedback/feedback.types';
import { ManagerDocumentData } from './manager-document.types';

@Component({
  selector: 'app-manager-document',
  standalone: true,
  imports: [DatePipe, RouterLink, MatIconModule, FeedbackBodyComponent, FeedbackTypeIconPipe],
  templateUrl: './manager-document.component.html',
  styleUrl: './manager-document.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export default class ManagerDocumentComponent implements ManagerDocumentData {
  document = input.required<Feedback | FeedbackRequest>();
}
