import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { NotFoundNavigationState } from '../not-found/not-found.types';
import { DialogTooltipDirective } from '../shared/dialog-tooltip';
import { FeedbackService } from '../shared/feedback/feedback.service';
import { MessageComponent } from '../shared/message/message.component';
import { ValidationErrorMessagePipe } from '../shared/validation/validation-error-message';

const ERROR_MESSAGES: Record<string, string> = {
  invalid_token: 'Le lien est invalide',
  token_expired: 'Le lien a expiré',
  token_max_uses_reached: "Ce lien a atteint le nombre maximum d'utilisations",
  email_already_used: 'Cet email a déjà été utilisé avec ce lien',
  invalid_email: "L'email est invalide",
  self_request_not_allowed: 'Vous ne pouvez pas vous demander un feedback à vous-même',
};

@Component({
  selector: 'app-pre-request-feedback-email',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MessageComponent,
    ValidationErrorMessagePipe,
    DialogTooltipDirective,
  ],
  templateUrl: './pre-request-feedback-email.component.html',
})
export class PreRequestFeedbackEmailComponent implements OnInit {
  private formBuilder = inject(NonNullableFormBuilder);
  private feedbackService = inject(FeedbackService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  protected token = '';
  protected receiverEmail = '';
  protected message = '';
  protected shared = false;

  protected submitError = '';

  protected form = this.formBuilder.group({
    giverEmail: ['', [Validators.required, Validators.email, this.emailNotSameAsReceiverValidator.bind(this)]],
  });

  ngOnInit() {
    this.token = this.activatedRoute.snapshot.params['token'];

    this.feedbackService.checkPreRequest(this.token).subscribe({
      next: (data) => {
        this.receiverEmail = data.receiverEmail;
        this.message = data.message;
        this.shared = data.shared;
      },
      error: (error: HttpErrorResponse) => {
        const errorType = error.error?.message || 'invalid_token';
        const errorDetails = ERROR_MESSAGES[errorType] || ERROR_MESSAGES['invalid_token'];

        const state: NotFoundNavigationState = {
          details: errorDetails,
        };
        this.router.navigate(['/not-found'], { state });
      },
    });
  }

  protected onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.form.disable();
    this.submitError = '';

    const { giverEmail } = this.form.getRawValue();

    this.feedbackService.preRequestEmail(this.token, giverEmail).subscribe({
      next: () => {
        this.router.navigate(['/pre-request-email/success']);
      },
      error: (error: HttpErrorResponse) => {
        const errorType = error.error?.message || 'invalid_token';
        this.submitError = ERROR_MESSAGES[errorType] || 'Une erreur est survenue';
        this.form.enable();
      },
    });
  }

  private emailNotSameAsReceiverValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value || !this.receiverEmail) {
      return null;
    }
    const isSameEmail = control.value.toLowerCase() === this.receiverEmail.toLowerCase();
    return isSameEmail ? { emailSameAsReceiver: true } : null;
  }
}
