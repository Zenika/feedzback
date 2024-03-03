import { DatePipe } from '@angular/common';
import { Component, ViewEncapsulation, computed, inject, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { ConfirmBeforeSubmitDirective } from '../../confirm-before-submit';
import { NotificationService } from '../../notification/notification.service';
import { MessageComponent } from '../../ui/message';
import { AllowedEmailDomainsPipe } from '../../validation/allowed-email-domains';
import { FeedbackBodyComponent } from '../feedback-body/feedback-body.component';
import { FeedbackTypeIconPipe } from '../feedback-type-icon.pipe';
import { FeedbackService } from '../feedback.service';
import { Feedback, FeedbackType } from '../feedback.types';

@Component({
  selector: 'app-done-feedback',
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    ConfirmBeforeSubmitDirective,
    MessageComponent,
    AllowedEmailDomainsPipe,
    FeedbackBodyComponent,
    FeedbackTypeIconPipe,
  ],
  templateUrl: './done-feedback.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class DoneFeedbackComponent {
  protected feedbackType = FeedbackType;

  feedback = input.required<Feedback>();

  type = input.required<FeedbackType>();

  colleagueEmail = computed(() =>
    this.type() === this.feedbackType.received ? this.feedback().giverEmail : this.feedback().receiverEmail,
  );

  private router = inject(Router);

  private feedbackService = inject(FeedbackService);

  private notificationService = inject(NotificationService);

  protected archiveForm = new FormGroup({});

  protected actionsStatus: 'enabled' | 'disabled' | 'hidden' = 'enabled';

  protected archive() {
    this.actionsStatus = 'disabled';
    this.feedbackService.archive(this.feedback().id).subscribe(() => {
      this.actionsStatus = 'hidden';
      this.notificationService.show(
        $localize`:@@Component.DoneFeedback.Archived:Le feedZback a bien été archivé.`,
        'success',
      );
      this.router.navigate(['/history']);
    });
  }
}
