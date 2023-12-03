import { Component, HostBinding, ViewEncapsulation, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../shared/api/api.service';
import { AuthService } from '../shared/auth/auth.service';
import { MessageComponent } from '../shared/message/message.component';
import { SendFeedback } from '../shared/types/send-feedback.types';
import { ALLOWED_EMAIL_DOMAINS } from '../shared/validation/allowed-email-domains/allowed-email-domain.provider';
import { allowedEmailDomainsValidatorFactory } from '../shared/validation/allowed-email-domains/allowed-email-domains.validator';
import { ValidationErrorMessagePipe } from '../shared/validation/validation-error-message.pipe';
import { SendFeedbackSuccess } from './send-feedback-success/send-feedback-success.types';
import { SendFeedbackService } from './send-feedback.service';

@Component({
  selector: 'app-send-feedback',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ValidationErrorMessagePipe,
    MessageComponent,
  ],
  templateUrl: './send-feedback.component.html',
  styleUrls: ['./send-feedback.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SendFeedbackComponent {
  @HostBinding('class.app-send-feedback') hasCss = true;

  private router = inject(Router);

  private activatedRoute = inject(ActivatedRoute);

  protected isAnonymous = inject(AuthService).userSnapshot?.isAnonymous;

  protected askedFeedbackDetails = inject(SendFeedbackService).askedFeedbackDetails;

  private apiService = inject(ApiService);

  private getQueryParam(key: string): string {
    return this.activatedRoute.snapshot.queryParams[key] ?? '';
  }

  protected messageMaxLength = 500;

  private allowedEmailDomainsValidator = allowedEmailDomainsValidatorFactory(inject(ALLOWED_EMAIL_DOMAINS));

  form = new FormGroup({
    receiverEmail: new FormControl(this.getQueryParam('receiverEmail'), [
      Validators.required,
      Validators.email,
      this.allowedEmailDomainsValidator,
    ]),
    positiveFeedback: new FormControl('', [Validators.required, Validators.maxLength(this.messageMaxLength)]),
    toImprove: new FormControl('', [Validators.required, Validators.maxLength(this.messageMaxLength)]),
    comment: new FormControl('', [Validators.maxLength(this.messageMaxLength)]),
  });

  submitInProgress = false;

  hasError = false;

  feedbackId?: string;

  async onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.hasError = false;
    this.disableForm(true);

    if (this.askedFeedbackDetails) {
      this.apiService
        .sendAskedFeedback(this.form.value as SendFeedback, this.askedFeedbackDetails.recipientToken)
        .subscribe((success) => {
          if (!success) {
            this.disableForm(false);
          } else {
            this.navigateToSuccess();
          }
        });
    } else {
      this.apiService.sendFeedback(this.form.value as SendFeedback).subscribe((feedbackId) => {
        this.hasError = feedbackId === false;
        if (feedbackId === false) {
          this.disableForm(false);
        } else {
          this.feedbackId = feedbackId;
          this.navigateToSuccess();
        }
      });
    }
  }

  private disableForm(submitInProgress: boolean) {
    this.form[submitInProgress ? 'disable' : 'enable']();
    this.submitInProgress = submitInProgress;
  }

  private navigateToSuccess() {
    const state: SendFeedbackSuccess = {
      receiverEmail: this.form.value.receiverEmail as string,
      feedbackId: this.isAnonymous ? undefined : this.feedbackId,
    };
    this.router.navigate(['success'], { relativeTo: this.activatedRoute, state });
  }
}
