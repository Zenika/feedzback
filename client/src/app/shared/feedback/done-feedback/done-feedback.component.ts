import { DatePipe } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MessageComponent } from '../../ui/message';
import { AllowedEmailDomainsPipe } from '../../validation/allowed-email-domains';
import { FeedbackBodyComponent } from '../feedback-body/feedback-body.component';
import { Feedback, FeedbackType } from '../feedback.types';

@Component({
  selector: 'app-done-feedback',
  host: { class: 'app-done-feedback' },
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    MatDialogModule,
    MatIconModule,
    AllowedEmailDomainsPipe,
    MessageComponent,
    FeedbackBodyComponent,
  ],
  templateUrl: './done-feedback.component.html',
  styleUrl: './done-feedback.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class DoneFeedbackComponent {
  @Input({ required: true }) feedback!: Feedback;

  @Input({ required: true }) type!: FeedbackType;

  protected feedbackType = FeedbackType;

  protected getColleagueEmail(feedback: Feedback): string | undefined {
    return this.type === this.feedbackType.received ? feedback.giverEmail : feedback.receiverEmail;
  }
}
