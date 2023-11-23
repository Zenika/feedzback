import { Component, HostBinding, ViewEncapsulation, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, from, toArray } from 'rxjs';
import { AskFeedbackSuccess } from '../ask-feedback/ask-feedback-success/ask-feedback-success.types';
import { AuthService } from '../shared/auth/auth.service';
import { GraphQLService } from '../shared/graphql/graphql.service';
import { MessageComponent } from '../shared/message/message.component';
import { AskFeedback } from '../shared/types/ask-feedback.types';
import { ValidationErrorMessagePipe } from '../shared/validation/validation-error-message.pipe';
import { EmailsFormComponent } from './emails-form/emails-form.component';

@Component({
  selector: 'app-ask-feedback-alt',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ValidationErrorMessagePipe,
    EmailsFormComponent,
    MessageComponent,
  ],
  templateUrl: './ask-feedback-alt.component.html',
  styleUrls: ['./ask-feedback-alt.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AskFeedbackAltComponent {
  @HostBinding('class.app-ask-feedback-alt') hasCss = true;

  private router = inject(Router);

  private activatedRoute = inject(ActivatedRoute);

  private authService = inject(AuthService);

  private graphQLService = inject(GraphQLService);

  protected receiverEmails: string[] = [this.activatedRoute.snapshot.queryParams['receverEmail'] ?? ''];

  protected messageMaxLength = 500;

  form = new FormGroup({
    receiverEmails: new FormArray<FormControl<string | null>>([]),
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

    const receiverEmails = this.form.controls.receiverEmails.value as string[];
    from(receiverEmails)
      .pipe(
        concatMap((receiverEmail) => this.graphQLService.askFeedback(this.buildAskFeedback(receiverEmail, token))),
        toArray(),
      )
      .subscribe((results) => {
        this.sentEmails = [...this.sentEmails, ...receiverEmails.filter((_, index) => results[index])];
        this.remainingUnsentEmails = receiverEmails.filter((_, index) => !results[index]);

        this.receiverEmails = this.remainingUnsentEmails;

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

  private navigateToSuccess() {
    const state: AskFeedbackSuccess = {
      receiverEmails: this.form.value.receiverEmails as string[],
    };
    this.router.navigate(['success'], { relativeTo: this.activatedRoute, state });
  }
}
