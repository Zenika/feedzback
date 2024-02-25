import { Component, ViewEncapsulation, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, from, toArray } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../shared/auth';
import { MultiAutocompleteEmailComponent } from '../shared/autocomplete-email';
import { ConfirmBeforeSubmitDirective } from '../shared/confirm-before-submit/confirm-before-submit.directive';
import { FeedbackRequestDto } from '../shared/feedback/feedback.dto';
import { FeedbackService } from '../shared/feedback/feedback.service';
import { DialogTooltipDirective } from '../shared/ui/dialog-tooltip';
import { MessageComponent } from '../shared/ui/message';
import { StringArrayError } from '../shared/validation';
import { FORBIDDEN_VALUES_KEY, forbiddenValuesValidatorFactory } from '../shared/validation/forbidden-values';
import {
  MULTIPLE_EMAILS_ERROR_KEY,
  MULTIPLE_EMAILS_PLACEHOLDER,
  getMultipleEmails,
  multipleEmailsValidatorFactory,
} from '../shared/validation/multiple-emails';
import { RequestFeedbackSuccess } from './request-feedback-success/request-feedback-success.types';
import { REQUEST_TEMPLATES } from './request-feedback.config';

@Component({
  selector: 'app-request-feedback',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MultiAutocompleteEmailComponent,
    ConfirmBeforeSubmitDirective,
    DialogTooltipDirective,
    MessageComponent,
  ],
  templateUrl: './request-feedback.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class RequestFeedbackComponent {
  private router = inject(Router);

  private activatedRoute = inject(ActivatedRoute);

  private formBuilder = inject(NonNullableFormBuilder);

  private feedbackService = inject(FeedbackService);

  private recipient: string = this.activatedRoute.snapshot.queryParams['recipient'] ?? '';

  protected messageMaxLength = 500;

  protected hasManagerFeature = environment.featureFlipping.manager;

  protected hasRequestTemplateFeature = environment.featureFlipping.requestTemplate;

  private readonly forbiddenValuesValidator = forbiddenValuesValidatorFactory([inject(AuthService).userEmail()]);

  protected form = this.formBuilder.group({
    recipients: [
      this.recipient ? [this.recipient] : [],
      [Validators.required, multipleEmailsValidatorFactory(), this.forbiddenValuesValidator],
    ],
    message: ['', [Validators.maxLength(this.messageMaxLength)]],
    shared: [this.hasManagerFeature ? true : false],
  });

  protected requestTemplates = REQUEST_TEMPLATES;

  protected multipleEmailsPlaceholder = MULTIPLE_EMAILS_PLACEHOLDER;

  protected sentEmails: string[] = [];

  protected remainingUnsentEmails: string[] = [];

  protected remainingInvalidEmails: string[] = [];

  protected isInvalidRecipient = (recipient: string) => {
    const { errors } = this.form.controls.recipients;

    const multipleEmailsError: StringArrayError | undefined = errors?.[MULTIPLE_EMAILS_ERROR_KEY];
    const forbiddenValuesError: StringArrayError | undefined = errors?.[FORBIDDEN_VALUES_KEY];

    const emailErrorsAggregate = [
      ...(multipleEmailsError?.fieldValues ?? []),
      ...(forbiddenValuesError?.fieldValues ?? []),
    ] satisfies string[];

    return emailErrorsAggregate.includes(recipient);
  };

  protected applyTemplate(message: string | undefined) {
    this.form.controls.message.setValue(message ?? '');
    this.form.controls.message.updateValueAndValidity();
  }

  protected async onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.form.disable();

    const recipients = getMultipleEmails(this.form.controls.recipients.value);
    from(recipients)
      .pipe(
        concatMap((recipient) => this.feedbackService.request(this.buildDto(recipient))),
        toArray(),
      )
      .subscribe((results) => {
        this.sentEmails = [...this.sentEmails, ...recipients.filter((_, index) => !results[index].error)];
        this.remainingUnsentEmails = recipients.filter((_, index) => results[index].error && !results[index].message);
        this.remainingInvalidEmails = recipients.filter(
          (_, index) => results[index].error && results[index].message === 'invalid_email',
        );

        this.setRecipients([...this.remainingUnsentEmails, ...this.remainingInvalidEmails]);

        if (this.remainingUnsentEmails.length || this.remainingInvalidEmails.length) {
          this.form.enable();
        } else {
          this.navigateToSuccess();
        }
      });
  }

  private buildDto(recipient: string): FeedbackRequestDto {
    return {
      recipient,
      message: this.form.controls.message.value,
      shared: this.form.controls.shared.value,
    };
  }

  private setRecipients(emails: string[]) {
    this.form.controls.recipients.setValue(emails);
    this.form.controls.recipients.updateValueAndValidity();
  }

  private navigateToSuccess() {
    const state: RequestFeedbackSuccess = {
      recipients: this.sentEmails,
    };
    this.router.navigate(['success'], { relativeTo: this.activatedRoute, state });
  }
}
