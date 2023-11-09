import { NgFor, NgIf } from '@angular/common';
import { Component, HostBinding, ViewEncapsulation, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../shared/auth/auth.service';
import { GraphQLService } from '../shared/graphql/graphql.service';
import { MessageComponent } from '../shared/message/message.component';
import { SendFeedback } from '../shared/types/send-feedback.types';
import { ALLOWED_EMAIL_DOMAINS } from '../shared/validation/allowed-email-domains/allowed-email-domain.provider';
import { allowedEmailDomainsValidatorFactory } from '../shared/validation/allowed-email-domains/allowed-email-domains.validator';
import { ValidationErrorMessagePipe } from '../shared/validation/validation-error-message.pipe';

@Component({
  selector: 'app-send-feedback',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatInputModule,
    ValidationErrorMessagePipe,
    MatIconModule,
    MessageComponent,
  ],
  templateUrl: './send-feedback.component.html',
  styleUrls: ['./send-feedback.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SendFeedbackComponent {
  @HostBinding('class.app-send-feedback') hasCss = true;

  private activatedRoute = inject(ActivatedRoute);

  private authService = inject(AuthService);

  private graphQLService = inject(GraphQLService);

  protected isAnonymous = this.authService.userSnapshot?.isAnonymous;

  private get defaultSenderEmail(): string {
    return this.isAnonymous
      ? this.activatedRoute.snapshot.queryParams['senderEmail']
      : this.authService.userSnapshot?.email;
  }

  private getQueryParam(key: string): string {
    return this.activatedRoute.snapshot.queryParams[key] ?? '';
  }

  protected messageMaxLength = 500;

  private allowedEmailDomainsValidator = allowedEmailDomainsValidatorFactory(inject(ALLOWED_EMAIL_DOMAINS));

  form = new FormGroup({
    senderEmail: new FormControl(this.defaultSenderEmail, [Validators.required, Validators.email]),
    receverEmail: new FormControl(this.getQueryParam('receverEmail'), [
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
    const token = await this.authService.getUserTokenId();
    if (!token || this.form.invalid) {
      return;
    }
    this.hasError = false;
    this.disableForm(true);

    this.graphQLService.sendFeedback(this.buildSendFeedback(token)).subscribe((feedbackId) => {
      this.hasError = feedbackId === false;
      if (feedbackId === false) {
        this.disableForm(false);
      } else {
        this.feedbackId = feedbackId;
      }
    });
  }

  private disableForm(submitInProgress: boolean) {
    this.form[submitInProgress ? 'disable' : 'enable']();
    this.submitInProgress = submitInProgress;
  }

  private buildSendFeedback(token: string): SendFeedback {
    return {
      token,
      ...(this.form.value as Omit<SendFeedback, 'token'>),
    };
  }

  protected signOut() {
    this.authService.signOut().subscribe();
  }
}
