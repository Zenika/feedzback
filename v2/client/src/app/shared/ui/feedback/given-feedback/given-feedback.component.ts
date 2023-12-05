import { DatePipe } from '@angular/common';
import { Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Feedback } from '../../../feedback/feedback.types';
import { AllowedEmailDomainsPipe } from '../../../form/allowed-email-domains';
import { MessageComponent } from '../../message/message.component';
import { FeedbackType } from '../feedback.types';

@Component({
  selector: 'app-given-feedback',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MessageComponent,
    AllowedEmailDomainsPipe,
  ],
  templateUrl: './given-feedback.component.html',
  styleUrl: './given-feedback.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class GivenFeedbackComponent {
  @HostBinding('class.app-given-feedback') hasCss = true;

  @Input({ required: true }) feedback!: Feedback;

  @Input({ required: true }) type!: FeedbackType;

  protected feedbackType = FeedbackType;

  protected geColleagueEmail(feedback: Feedback): string | undefined {
    return this.type === this.feedbackType.received ? feedback.senderEmail : feedback.receiverEmail;
  }
}
