import { NgFor, NgIf } from '@angular/common';
import { Component, ViewEncapsulation, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { concatMap, from, map, toArray } from 'rxjs';
import { AuthService } from '../shared/auth/auth.service';
import {
  MULTIPLE_EMAILS_SEP,
  getMultipleEmails,
  multipleEmailsValidatorFactory,
} from '../shared/forms/multiple-emails.validators';
import { ValidationErrorMessagePipe } from '../shared/forms/validation-error-message.pipe';
import { GraphQLService } from '../shared/graphql/graphql.service';
import { MessageComponent } from '../shared/message/message.component';
import { AskFeedback } from '../shared/types/ask-feedback.types';

@Component({
  selector: 'app-ask-feedback',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    ValidationErrorMessagePipe,
    MessageComponent,
  ],
  templateUrl: './ask-feedback.component.html',
  styleUrls: ['./ask-feedback.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AskFeedbackComponent {
  private activatedRoute = inject(ActivatedRoute);

  private authService = inject(AuthService);

  private graphQLService = inject(GraphQLService);

  private receiverEmail = this.activatedRoute.snapshot.queryParamMap.get('receverEmail') || '';

  protected messageMaxLength = 500;

  form = new FormGroup({
    receiverEmails: new FormControl(this.receiverEmail, [multipleEmailsValidatorFactory()]),
    message: new FormControl('', [Validators.maxLength(this.messageMaxLength)]),
  });

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
        map(({ data }) => data?.sendFeedbackRequest === 'sent'),
        toArray(),
      )
      .subscribe((results) => {
        this.sentEmails = [...this.sentEmails, ...receiverEmails.filter((_, index) => results[index])];
        this.remainingUnsentEmails = receiverEmails.filter((_, index) => !results[index]);

        this.setReceiverEmails(this.remainingUnsentEmails);

        if (this.remainingUnsentEmails.length) {
          this.disableForm(false);
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
      name: this.authService.userSnapshot?.displayName ?? '',
      email: this.authService.userSnapshot?.email ?? '',
      senderEmail: receiverEmail, // !FIXME: the `senderEmail` is indeed the email of the receiver...
      text: this.form.controls.message.value ?? '',
    };
  }

  private setReceiverEmails(emails: string[]) {
    this.form.controls.receiverEmails.setValue(emails.join(MULTIPLE_EMAILS_SEP));
    this.form.controls.receiverEmails.updateValueAndValidity();
  }
}
