import { DatePipe } from '@angular/common';
import { Component, ViewEncapsulation, computed, inject, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ConfirmBeforeSubmitDirective } from '../../dialogs/confirm-before-submit';
import { NotificationService } from '../../notification/notification.service';
import { AllowedEmailDomainsPipe } from '../../validation/allowed-email-domains';
import { FeedbackBodyComponent } from '../feedback-body/feedback-body.component';
import { FeedbackTypeIconPipe } from '../feedback-type-icon.pipe';
import { FEEDBACK_REQUEST_DEADLINE_IN_DAYS } from '../feedback.config';
import { FeedbackService } from '../feedback.service';
import { FeedbackRequest, FeedbackType } from '../feedback.types';
import { isRecentFeedbackRequest } from '../feedback.utils';
import { GiveRequestedFeedbackDirective } from '../give-requested-feedback.directive';

@Component({
  selector: 'app-pending-feedback',
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    AllowedEmailDomainsPipe,
    ConfirmBeforeSubmitDirective,
    FeedbackBodyComponent,
    FeedbackTypeIconPipe,
    GiveRequestedFeedbackDirective,
  ],
  templateUrl: './pending-feedback.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class PendingFeedbackComponent {
  protected feedbackType = FeedbackType;

  feedback = input.required<FeedbackRequest>();

  type = input.required<FeedbackType>();

  colleagueEmail = computed(() =>
    this.type() === this.feedbackType.sentRequest ? this.feedback().giverEmail : this.feedback().receiverEmail,
  );

  private router = inject(Router);

  private feedbackService = inject(FeedbackService);

  private notificationService = inject(NotificationService);

  protected get hasBeenRequestedAgain() {
    return this.feedback().updatedAt > this.feedback().createdAt;
  }

  protected get isRecentFeedbackRequest() {
    return isRecentFeedbackRequest(this.feedback().updatedAt);
  }

  protected DEADLINE_IN_DAYS = FEEDBACK_REQUEST_DEADLINE_IN_DAYS;

  protected cancelRequestForm = new FormGroup({});

  protected actionsStatus: 'enabled' | 'disabled' | 'hidden' = 'enabled';

  protected requestAgain() {
    this.actionsStatus = 'disabled';
    this.feedbackService.requestAgain(this.feedback().id).subscribe(() => {
      this.actionsStatus = 'hidden';
      this.notificationService.show(
        $localize`:@@Component.PendingFeedback.ReminderSent:Un rappel a été envoyé à votre collègue.`,
        'success',
      );
    });
  }

  protected cancelRequest() {
    this.actionsStatus = 'disabled';
    this.feedbackService.cancelRequest(this.feedback().id).subscribe(({ error }) => {
      if (error) {
        return;
      }
      this.actionsStatus = 'hidden';
      this.notificationService.show(
        $localize`:@@Component.PendingFeedback.RequestCancelled:La demande de feedZback a bien été archivée.`,
        'success',
      );
      this.router.navigate(['/history/type/sentRequest']);
    });
  }
}
