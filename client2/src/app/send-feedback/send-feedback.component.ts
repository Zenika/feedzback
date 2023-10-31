import { NgFor, NgIf } from '@angular/common';
import { Component, ViewEncapsulation, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../shared/auth/auth.service';
import { ValidationErrorMessagePipe } from '../shared/forms/validation-error-message.pipe';
import { GraphQLService } from '../shared/graphql/graphql.service';
import { MessageComponent } from '../shared/message/message.component';
import { SendFeedback } from '../shared/types/send-feedback.types';

@Component({
  selector: 'app-send-feedback-form',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
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
  private activatedRoute = inject(ActivatedRoute);

  private authService = inject(AuthService);

  private graphQLService = inject(GraphQLService);

  private receverEmail: string = this.activatedRoute.snapshot.params['receverEmail'] ?? '';

  private receverName: string = this.activatedRoute.snapshot.params['receverName'] ?? '';

  protected messageMaxLength = 500;

  form = new FormGroup({
    receverEmail: new FormControl(this.receverEmail, [Validators.required, Validators.email]),
    receverName: new FormControl(this.receverName, Validators.required),
    postitiveFeedback: new FormControl('', [Validators.required, Validators.maxLength(this.messageMaxLength)]),
    toImproveFeedback: new FormControl('', [Validators.required, Validators.maxLength(this.messageMaxLength)]),
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
      if (this.hasError) {
        this.disableForm(false);
      } else {
        this.feedbackId = feedbackId as string;
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
      senderName: this.activatedRoute.snapshot.params['senderName'] ?? this.authService.userSnapshot?.displayName ?? '',
      senderEmail: this.activatedRoute.snapshot.params['senderEmail'] ?? this.authService.userSnapshot?.email ?? '',
      receverEmail: this.form.controls.receverEmail.value ?? '',
      receverName: this.form.controls.receverName.value ?? '',
      positiveFeedback: this.form.controls.postitiveFeedback.value ?? '',
      toImprove: this.form.controls.toImproveFeedback.value ?? '',
      comment: this.form.controls.comment.value ?? '',
    };
  }
}
