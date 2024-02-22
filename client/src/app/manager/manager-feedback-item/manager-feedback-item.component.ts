import { JsonPipe } from '@angular/common';
import { Component, ViewEncapsulation, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { FeedbackService } from '../../shared/feedback/feedback.service';

@Component({
  selector: 'app-manager-feedback-item',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './manager-feedback-item.component.html',
  styleUrl: './manager-feedback-item.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export default class ManagerFeedbackItemComponent {
  private managerEmail = inject(ActivatedRoute).snapshot.queryParams['employee'];

  private feedbackId = inject(ActivatedRoute).snapshot.params['feedbackId'];

  private feedbackService = inject(FeedbackService);

  protected feedback = toSignal(this.feedbackService.getManagedFeedbackDocument(this.managerEmail, this.feedbackId));
}
