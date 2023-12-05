import { DatePipe } from '@angular/common';
import { Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AllowedEmailDomainsPipe } from '../../form/allowed-email-domains';
import { AskedFeedback, FeedbackType } from '../feedback.types';

@Component({
  selector: 'app-asked-feedback',
  standalone: true,
  imports: [DatePipe, RouterLink, MatButtonModule, MatIconModule, AllowedEmailDomainsPipe],
  templateUrl: './asked-feedback.component.html',
  styleUrl: './asked-feedback.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AskedFeedbackComponent {
  @HostBinding('class.app-asked-feedback') hasCss = true;

  @Input({ required: true }) feedback!: AskedFeedback;

  @Input({ required: true }) type!: FeedbackType;

  protected feedbackType = FeedbackType;

  protected geColleagueEmail(feedback: AskedFeedback): string | undefined {
    return this.type === this.feedbackType.asked ? feedback.senderEmail : feedback.receiverEmail;
  }
}
