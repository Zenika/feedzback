import { DatePipe } from '@angular/common';
import { Component, ViewEncapsulation, computed, inject, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ConfirmBeforeSubmitDirective } from '../../dialog/confirm-before-submit';
import { NotificationService } from '../../notification';
import { FeedbackBodyComponent } from '../feedback-body/feedback-body.component';
import { FeedbackTypeIconPipe } from '../feedback-type-icon.pipe';
import { FeedbackService } from '../feedback.service';
import { Feedback, FeedbackType } from '../feedback.types';
import { buildFeedbackSharedMessage, buildFeedbackTitle } from '../feedback.utils';

@Component({
  selector: 'app-done-feedback',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    ConfirmBeforeSubmitDirective,
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

  protected title = computed(() => buildFeedbackTitle(this.type()));

  protected colleagueEmail = computed(() =>
    this.type() === this.feedbackType.received ? this.feedback().giverEmail : this.feedback().receiverEmail,
  );

  protected sharedMessage = computed(() => buildFeedbackSharedMessage(this.type()));

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
