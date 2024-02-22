import { JsonPipe } from '@angular/common';
import { Component, ViewEncapsulation, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Feedback, FeedbackRequest } from '../../shared/feedback/feedback.types';
import { ManagerDocumentData } from './manager-document.types';

@Component({
  selector: 'app-manager-document',
  standalone: true,
  imports: [JsonPipe, RouterLink],
  templateUrl: './manager-document.component.html',
  styleUrl: './manager-document.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export default class ManagerDocumentComponent implements ManagerDocumentData {
  document = input.required<Feedback | FeedbackRequest>();
}
