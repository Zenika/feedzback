import { Component, TemplateRef, ViewEncapsulation, inject, viewChild } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, from, toArray } from 'rxjs';
import { AuthService } from '../shared/auth';
import { MultiAutocompleteEmailComponent } from '../shared/autocomplete-email';
import { BreakpointService } from '../shared/breakpoint';
import { ConfirmBeforeSubmitDirective } from '../shared/confirm-before-submit';
import { DialogTooltipDirective } from '../shared/dialog-tooltip';
import { FeedbackService, PreRequestFeedbackService } from '../shared/feedback';
import { SMALL_MAX_LENGTH } from '../shared/feedback/feedback.config';
import { FeedbackRequestDto } from '../shared/feedback/feedback.dto';
import { IconDirective } from '../shared/icon';
import { MessageComponent } from '../shared/message';
import { StringArrayError } from '../shared/validation';
import { FORBIDDEN_VALUES_KEY, forbiddenValuesValidatorFactory } from '../shared/validation/forbidden-values';
import {
  MULTIPLE_EMAILS_ERROR_KEY,
  MULTIPLE_EMAILS_PLACEHOLDER,
  getMultipleEmails,
  multipleEmailsValidatorFactory,
} from '../shared/validation/multiple-emails';
import { FeedbackPreRequestListComponent } from './feedback-pre-request-list/feedback-pre-request-list.component';
import { RequestFeedbackSuccess } from './request-feedback-success/request-feedback-success.types';
import {
  FEEDBACK_PRE_REQUEST_EXPIRATION_IN_DAYS,
  FEEDBACK_PRE_REQUEST_MAX_USES,
  REQUEST_TEMPLATES,
} from './request-feedback.config';

@Component({
  selector: 'app-request-feedback',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MultiAutocompleteEmailComponent,
    ConfirmBeforeSubmitDirective,
    DialogTooltipDirective,
    IconDirective,
    MessageComponent,
    FeedbackPreRequestListComponent,
  ],
  templateUrl: './request-feedback.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class RequestFeedbackComponent {
  private router = inject(Router);

  private activatedRoute = inject(ActivatedRoute);

  private formBuilder = inject(NonNullableFormBuilder);

  private matDialog = inject(MatDialog);

  protected device = toSignal(inject(BreakpointService).device$);

  private feedbackService = inject(FeedbackService);

  private preRequestFeedbackService = inject(PreRequestFeedbackService);

  private magicLinkDialogRef?: MatDialogRef<unknown>;

  magicLinkDialogTmpl = viewChild.required<TemplateRef<unknown>>('magicLinkDialogTmpl');

  protected magicLinkList = toSignal(this.feedbackService.getPreRequestList()); // Note: this value is NOT reactive!

  private recipient: string = this.activatedRoute.snapshot.queryParams['recipient'] ?? '';

  protected messageMaxLength = SMALL_MAX_LENGTH;

  protected preRequestConfig = {
    expirationInDays: FEEDBACK_PRE_REQUEST_EXPIRATION_IN_DAYS,
    maxUses: FEEDBACK_PRE_REQUEST_MAX_USES,
  };

  private readonly forbiddenValuesValidator = forbiddenValuesValidatorFactory([inject(AuthService).userEmail()]);

  protected form = this.formBuilder.group({
    method: ['send'] as ('send' | 'generate')[],
    recipients: [
      this.recipient ? [this.recipient] : [],
      [Validators.required, multipleEmailsValidatorFactory(), this.forbiddenValuesValidator],
    ],
    message: ['', [Validators.maxLength(this.messageMaxLength)]],
    shared: [true],
  });

  constructor() {
    this.form.controls.method.valueChanges.pipe(takeUntilDestroyed()).subscribe((method) => {
      this.form.controls.recipients[method === 'generate' ? 'disable' : 'enable']();
    });
  }

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

  protected onSubmit() {
    if (this.form.controls.method.value === 'send') {
      this.send();
    } else {
      this.generate();
    }
  }

  private send() {
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
        this.remainingUnsentEmails = recipients.filter(
          (_, index) => results[index].error && results[index].message !== 'invalid_email',
        );
        this.remainingInvalidEmails = recipients.filter(
          (_, index) => results[index].error && results[index].message === 'invalid_email',
        );

        this.setRecipients([...this.remainingUnsentEmails, ...this.remainingInvalidEmails]);

        if (this.remainingUnsentEmails.length || this.remainingInvalidEmails.length) {
          this.form.enable();
        } else {
          this.navigateToSuccess({
            method: 'send',
            recipients: this.sentEmails,
          });
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

  private generate() {
    if (this.form.invalid) {
      return;
    }
    this.form.disable();

    const { message, shared } = this.form.getRawValue();

    this.feedbackService.preRequestToken({ message, shared }).subscribe(({ token }) => {
      this.navigateToSuccess({
        method: 'generate',
        magicLink: this.preRequestFeedbackService.buildMagicLink(token),
      });
    });
  }

  private navigateToSuccess(state: RequestFeedbackSuccess) {
    this.router.navigate(['success'], { relativeTo: this.activatedRoute, state });
  }

  protected openMagicLinksDialog() {
    this.magicLinkDialogRef = this.matDialog.open(this.magicLinkDialogTmpl(), { width: '560px' });
    this.magicLinkDialogRef.afterClosed().subscribe(() => (this.magicLinkDialogRef = undefined));
  }
}
