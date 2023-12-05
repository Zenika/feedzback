import { Component, HostBinding, ViewEncapsulation, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../shared/auth/auth.service';
import { FeedbackService } from '../shared/feedback/feedback.service';
import { MessageComponent } from '../shared/ui/message/message.component';
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
    MatSlideToggleModule,
    ValidationErrorMessagePipe,
    MessageComponent,
  ],
  templateUrl: './send-feedback.component.html',
  styleUrl: './send-feedback.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SendFeedbackComponent {
  @HostBinding('class.app-send-feedback') hasCss = true;

  private router = inject(Router);

  private activatedRoute = inject(ActivatedRoute);

  private formBuilder = inject(NonNullableFormBuilder);

  protected isAnonymous = inject(AuthService).userSnapshot?.isAnonymous;

  protected askedFeedback = inject(SendFeedbackService).askedFeedback;

  private feedbackService = inject(FeedbackService);

  private getQueryParam(key: string): string {
    return this.activatedRoute.snapshot.queryParams[key] ?? '';
  }

  protected messageMaxLength = 500;

  private allowedEmailDomainsValidator = allowedEmailDomainsValidatorFactory(inject(ALLOWED_EMAIL_DOMAINS));

  form = this.formBuilder.group({
    receiverEmail: [
      this.askedFeedback?.receiverEmail ?? this.getQueryParam('receiverEmail'),
      [Validators.required, Validators.email, this.allowedEmailDomainsValidator],
    ],
    positive: ['', [Validators.required, Validators.maxLength(this.messageMaxLength)]],
    negative: ['', [Validators.required, Validators.maxLength(this.messageMaxLength)]],
    comment: ['', [Validators.maxLength(this.messageMaxLength)]],
    shared: [this.askedFeedback?.shared ?? true],
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

    const { receiverEmail, positive, negative, comment, shared } = this.form.value as Required<typeof this.form.value>;

    if (this.askedFeedback) {
      this.feedbackService
        .sendAsked({ id: this.askedFeedback.id, positive, negative, comment })
        .subscribe((success) => {
          if (!success) {
            this.hasError = true;
            this.disableForm(false);
          } else {
            this.feedbackId = this.isAnonymous ? undefined : this.askedFeedback?.id;
            this.navigateToSuccess();
          }
        });
    } else {
      this.feedbackService.send({ receiverEmail, positive, negative, comment, shared }).subscribe(({ id }) => {
        this.hasError = !id;
        if (!id) {
          this.disableForm(false);
        } else {
          this.feedbackId = id;
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
