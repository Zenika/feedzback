import { Component, HostBinding, ViewEncapsulation, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, from, toArray } from 'rxjs';
import { AuthService } from '../shared/auth/auth.service';
import { GraphQLService } from '../shared/graphql/graphql.service';
import { MessageComponent } from '../shared/message/message.component';
import { AskFeedback } from '../shared/types/ask-feedback.types';
import {
  MULTIPLE_EMAILS_PLACEHOLDER,
  getMultipleEmails,
  multipleEmailsValidatorFactory,
} from '../shared/validation/multiple-emails.validator';
import { AskFeedbackSuccess } from './ask-feedback-success/ask-feedback-success.types';
import { EmailsFieldComponent } from './emails-field/emails-field.component';

@Component({
  selector: 'app-ask-feedback',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MessageComponent,
    EmailsFieldComponent,
  ],
  templateUrl: './ask-feedback.component.html',
  styleUrls: ['./ask-feedback.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AskFeedbackComponent {
  @HostBinding('class.app-ask-feedback') hasCss = true;

  private router = inject(Router);

  private activatedRoute = inject(ActivatedRoute);

  private authService = inject(AuthService);

  private graphQLService = inject(GraphQLService);

  private receiverEmail: string = this.activatedRoute.snapshot.queryParams['receverEmail'] ?? '';

  protected messageMaxLength = 500;

  form = new FormGroup({
    receiverEmails: new FormControl(this.receiverEmail ? [this.receiverEmail] : [], {
      nonNullable: true,
      validators: [Validators.required, multipleEmailsValidatorFactory()],
    }),
    message: new FormControl('', [Validators.maxLength(this.messageMaxLength)]),
  });

  multipleEmailsPlaceholder = MULTIPLE_EMAILS_PLACEHOLDER;

  submitInProgress = false;

  sentEmails: string[] = [];

  remainingUnsentEmails: string[] = [];

  async onSubmit() {
    const token = await this.authService.getUserTokenId();
    if (!token || this.form.invalid) {
      return;
    }
    this.disableForm(true);

    const receiverEmails = getMultipleEmails(this.form.controls.receiverEmails.value);
    from(receiverEmails)
      .pipe(
        concatMap((receiverEmail) => this.graphQLService.askFeedback(this.buildAskFeedback(receiverEmail, token))),
        toArray(),
      )
      .subscribe((results) => {
        this.sentEmails = [...this.sentEmails, ...receiverEmails.filter((_, index) => results[index])];
        this.remainingUnsentEmails = receiverEmails.filter((_, index) => !results[index]);

        this.setReceiverEmails(this.remainingUnsentEmails);

        if (this.remainingUnsentEmails.length) {
          this.disableForm(false);
        } else {
          this.navigateToSuccess();
        }
      });
  }

  private disableForm(submitInProgress: boolean) {
    this.form[submitInProgress ? 'disable' : 'enable']();
    this.submitInProgress = submitInProgress;
  }

  private buildAskFeedback(receiverEmail: string, token: string): AskFeedback {
    return {
      token,
      email: this.authService.userSnapshot?.email ?? '',
      senderEmail: receiverEmail, // !FIXME: the `senderEmail` is indeed the email of the receiver...
      text: this.form.controls.message.value ?? '',
    };
  }

  private setReceiverEmails(emails: string[]) {
    this.form.controls.receiverEmails.setValue(emails);
    this.form.controls.receiverEmails.updateValueAndValidity();
  }

  private navigateToSuccess() {
    const state: AskFeedbackSuccess = {
      receiverEmails: this.sentEmails,
    };
    this.router.navigate(['success'], { relativeTo: this.activatedRoute, state });
  }
}
