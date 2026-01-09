import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { FeedbackTypeIconPipe } from '../shared/feedback';
import { MultiLineComponent } from '../shared/feedback/feedback-body/multi-line';
import { FeedbackService } from '../shared/feedback/feedback.service';
import { FeedbackPreRequestSummary } from '../shared/feedback/feedback.types';
import { MessageComponent } from '../shared/message/message.component';
import { forbiddenValuesValidatorFactory } from '../shared/validation/forbidden-values';
import { ValidationErrorMessagePipe } from '../shared/validation/validation-error-message';
import { PreRequestFeedbackSuccess } from './pre-request-feedback-success/pre-request-feedback-success.types';
import { getPreRequestFeedbackErrMsg } from './pre-request-feedback.constants';

@Component({
  selector: 'app-pre-request-feedback',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FeedbackTypeIconPipe,
    MultiLineComponent,
    MessageComponent,
    ValidationErrorMessagePipe,
  ],
  templateUrl: './pre-request-feedback.component.html',
})
export class PreRequestFeedbackComponent {
  private router = inject(Router);

  private activatedRoute = inject(ActivatedRoute);

  private formBuilder = inject(NonNullableFormBuilder);

  private feedbackService = inject(FeedbackService);

  token = input.required<string>();

  summary = input.required<FeedbackPreRequestSummary>();

  protected form = this.formBuilder.group({
    recipient: ['', [Validators.required, Validators.email]],
  });

  protected errorMessage = signal('');

  constructor() {
    effect(() => {
      const { receiverEmail } = this.summary();
      this.form.controls.recipient.addValidators(forbiddenValuesValidatorFactory([receiverEmail]));
      this.form.controls.recipient.updateValueAndValidity();
    });
  }

  protected onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.form.disable();
    this.errorMessage.set('');

    const { recipient } = this.form.getRawValue();

    this.feedbackService.preRequestEmail({ token: this.token(), recipient }).subscribe({
      next: () => {
        const state: PreRequestFeedbackSuccess = { recipient };
        this.router.navigate(['../../success'], { relativeTo: this.activatedRoute, state });
      },
      error: (response: HttpErrorResponse) => {
        this.form.enable();
        this.errorMessage.set(getPreRequestFeedbackErrMsg(response) ?? '');
      },
    });
  }
}
