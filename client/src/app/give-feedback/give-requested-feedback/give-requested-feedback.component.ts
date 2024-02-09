import { Component, Input, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLinkWithHref } from '@angular/router';
import { AuthService } from '../../shared/auth';
import { FeedbackService } from '../../shared/feedback/feedback.service';
import { FeedbackRequest, FeedbackRequestDraft } from '../../shared/feedback/feedback.types';
import { LeaveFormService } from '../../shared/leave-form/leave-form.service';
import { LeaveForm } from '../../shared/leave-form/leave-form.types';
import { DialogTooltipDirective } from '../../shared/ui/dialog-tooltip/dialog-tooltip.directive';
import { MessageComponent } from '../../shared/ui/message/message.component';
import { GiveFeedbackSuccess } from '../give-feedback-success/give-feedback-success.types';
import { GiveFeedbackDetailsComponent } from '../shared/give-feedback-details/give-feedback-details.component';
import { GiveRequestedFeedbackData } from './give-requested-feedback.types';

@Component({
  selector: 'app-give-requested-feedback',
  standalone: true,
  imports: [
    RouterLinkWithHref,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatIconModule,
    MatInputModule,
    DialogTooltipDirective,
    MessageComponent,
    GiveFeedbackDetailsComponent,
  ],
  providers: [LeaveFormService],
  templateUrl: './give-requested-feedback.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class GiveRequestedFeedbackComponent implements GiveRequestedFeedbackData, LeaveForm, OnInit {
  @Input({ required: true }) token!: string;

  @Input({ required: true }) request!: FeedbackRequest;

  @Input({ required: true }) draft?: Pick<FeedbackRequestDraft, 'positive' | 'negative' | 'comment'>;

  private router = inject(Router);

  private activatedRoute = inject(ActivatedRoute);

  private formBuilder = inject(NonNullableFormBuilder);

  protected isAnonymous = inject(AuthService).userSnapshot?.isAnonymous;

  private feedbackService = inject(FeedbackService);

  leaveFormService = inject(LeaveFormService);

  form = this.formBuilder.group({
    positive: [''], // Note: validators are defined in `GiveFeedbackDetailsComponent`
    negative: [''], // Note: validators are defined in `GiveFeedbackDetailsComponent`
    comment: [''], // Note: validators are defined in `GiveFeedbackDetailsComponent`
  });

  submitInProgress = false;

  showError = false;

  showDraft = false;

  feedbackId?: string;

  constructor() {
    this.leaveFormService.registerForm(this.form);
  }

  ngOnInit(): void {
    if (this.draft) {
      this.form.setValue(this.draft);
      this.form.updateValueAndValidity();
      this.leaveFormService.takeSnapshot();
    }
  }

  protected onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.showError = false;
    this.disableForm(true);

    const { positive, negative, comment } = this.form.value as Required<typeof this.form.value>;

    this.feedbackService.giveRequested({ token: this.token, positive, negative, comment }).subscribe((success) => {
      if (!success) {
        this.showError = true;
        this.disableForm(false);
      } else {
        this.leaveFormService.unregisterForm();
        this.feedbackId = this.isAnonymous ? undefined : this.request?.id;
        this.navigateToSuccess();
      }
    });
  }

  protected onDraft() {
    this.showError = false;
    this.disableForm(true);

    const { positive, negative, comment } = this.form.value as Required<typeof this.form.value>;

    this.feedbackService.giveRequestedDraft({ token: this.token, positive, negative, comment }).subscribe({
      error: () => {},
      complete: () => {
        this.showDraft = true;
        this.disableForm(false);
        this.leaveFormService.takeSnapshot();
      },
    });
  }

  private disableForm(submitInProgress: boolean) {
    this.form[submitInProgress ? 'disable' : 'enable']();
    this.submitInProgress = submitInProgress;
  }

  private navigateToSuccess() {
    const state: GiveFeedbackSuccess = {
      receiverEmail: this.request.receiverEmail,
      feedbackId: this.isAnonymous ? undefined : this.feedbackId,
    };
    this.router.navigate(['../../success'], { relativeTo: this.activatedRoute, state });
  }
}
