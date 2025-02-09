import { Component, ViewEncapsulation, effect, inject, input } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/auth';
import { DialogTooltipDirective } from '../../shared/dialog-tooltip';
import { ConfirmBeforeSubmitDirective } from '../../shared/dialog/confirm-before-submit';
import { LeaveForm, LeaveFormService } from '../../shared/dialog/leave-form';
import { FeedbackService, FeedbackTypeIconPipe } from '../../shared/feedback';
import { FeedbackRequest, FeedbackRequestDraft } from '../../shared/feedback/feedback.types';
import { MessageComponent } from '../../shared/message';
import { NotificationService } from '../../shared/notification';
import { GiveFeedbackSuccess } from '../give-feedback-success/give-feedback-success.types';
import { GiveRequestedFeedbackListService } from '../give-requested-feedback-list/give-requested-feedback-list.service';
import { GiveFeedbackDetailsComponent } from '../shared/give-feedback-details/give-feedback-details.component';
import { GiveRequestedFeedbackData } from './give-requested-feedback.types';

@Component({
  selector: 'app-give-requested-feedback',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatIconModule,
    MatInputModule,
    ConfirmBeforeSubmitDirective,
    FeedbackTypeIconPipe,
    DialogTooltipDirective,
    MessageComponent,
    GiveFeedbackDetailsComponent,
  ],
  providers: [LeaveFormService],
  templateUrl: './give-requested-feedback.component.html',
  styleUrl: './give-requested-feedback.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class GiveRequestedFeedbackComponent implements GiveRequestedFeedbackData, LeaveForm {
  token = input.required<string>();

  request = input.required<FeedbackRequest>();

  draft = input<Pick<FeedbackRequestDraft, 'context' | 'positive' | 'negative' | 'comment'>>();

  private router = inject(Router);

  private activatedRoute = inject(ActivatedRoute);

  private formBuilder = inject(NonNullableFormBuilder);

  protected anonymous = inject(AuthService).userStatus().anonymous;

  private feedbackService = inject(FeedbackService);

  private giveRequestedFeedbackListService = inject(GiveRequestedFeedbackListService);

  private notificationService = inject(NotificationService);

  leaveFormService = inject(LeaveFormService);

  form = this.formBuilder.group({
    context: [''], // Note: validators are defined in `GiveFeedbackDetailsComponent`
    positive: [''], // Note: validators are defined in `GiveFeedbackDetailsComponent`
    negative: [''], // Note: validators are defined in `GiveFeedbackDetailsComponent`
    comment: [''], // Note: validators are defined in `GiveFeedbackDetailsComponent`
  });

  submitInProgress = false;

  feedbackId?: string;

  constructor() {
    this.leaveFormService.registerForm(this.form);

    const effectRef = effect(
      () => {
        const draft = this.draft();
        if (draft) {
          this.form.patchValue(draft);
          this.form.updateValueAndValidity();
          this.leaveFormService.takeSnapshot();
        }
        effectRef.destroy();
      },
      { manualCleanup: true },
    );
  }

  protected onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.disableForm(true);

    const { context, positive, negative, comment } = this.form.value as Required<typeof this.form.value>;

    this.feedbackService
      .giveRequested({ token: this.token(), context, positive, negative, comment })
      .subscribe((success) => {
        if (!success) {
          this.disableForm(false);
          this.notificationService.showError();
        } else {
          this.giveRequestedFeedbackListService.refresh();
          this.leaveFormService.unregisterForm();
          this.feedbackId = this.anonymous ? undefined : this.request()?.id;
          this.navigateToSuccess();
        }
      });
  }

  protected onDraft() {
    this.disableForm(true);

    const { context, positive, negative, comment } = this.form.value as Required<typeof this.form.value>;

    this.feedbackService.giveRequestedDraft({ token: this.token(), context, positive, negative, comment }).subscribe({
      error: () => this.notificationService.showError(),
      complete: () => {
        this.disableForm(false);
        this.leaveFormService.takeSnapshot();
        this.notificationService.show($localize`:@@Message.DraftSaved:Brouillon sauvegardé.`, 'success');
      },
    });
  }

  private disableForm(submitInProgress: boolean) {
    this.form[submitInProgress ? 'disable' : 'enable']();
    this.submitInProgress = submitInProgress;
  }

  private navigateToSuccess() {
    const state: GiveFeedbackSuccess = {
      receiverEmail: this.request().receiverEmail,
      feedbackId: this.anonymous ? undefined : this.feedbackId,
    };
    this.router.navigate(['../../success'], { relativeTo: this.activatedRoute, state });
  }
}
