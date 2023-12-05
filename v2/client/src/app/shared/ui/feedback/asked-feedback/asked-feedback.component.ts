import { DatePipe, JsonPipe } from '@angular/common';
import { Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AskedFeedback } from '../../../feedback/feedback.types';
import { AllowedEmailDomainsPipe } from '../../../form/allowed-email-domains';
import { MessageComponent } from '../../message/message.component';
import { FeedbackType } from '../feedback.types';

@Component({
  selector: 'app-asked-feedback',
  standalone: true,
  imports: [
    JsonPipe, // TODO: remove the JsonPipe
    DatePipe,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MessageComponent,
    AllowedEmailDomainsPipe,
  ],
  templateUrl: './asked-feedback.component.html',
  styleUrl: './asked-feedback.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AskedFeedbackComponent {
  @HostBinding('class.app-asked-feedback') hasCss = true;

  @Input({ required: true }) askedFeedback!: AskedFeedback;

  @Input({ required: true }) type!: FeedbackType;

  protected feedbackType = FeedbackType;

  protected geColleagueEmail(feedback: AskedFeedback): string | undefined {
    return this.type === this.feedbackType.received ? feedback.senderEmail : feedback.receiverEmail;
  }
}
