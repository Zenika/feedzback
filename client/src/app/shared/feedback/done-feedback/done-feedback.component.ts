import { DatePipe } from '@angular/common';
import { Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { AllowedEmailDomainsPipe } from '../../form/allowed-email-domains';
import { MessageComponent } from '../../ui/message/message.component';
import { Feedback, FeedbackType } from '../feedback.types';

@Component({
  selector: 'app-done-feedback',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    MessageComponent,
    AllowedEmailDomainsPipe,
  ],
  templateUrl: './done-feedback.component.html',
  styleUrl: './done-feedback.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class DoneFeedbackComponent {
  @HostBinding('class.app-done-feedback') hasCss = true;

  @Input({ required: true }) feedback!: Feedback;

  @Input({ required: true }) type!: FeedbackType;

  protected feedbackType = FeedbackType;

  protected getColleagueEmail(feedback: Feedback): string | undefined {
    return this.type === this.feedbackType.received ? feedback.giverEmail : feedback.receiverEmail;
  }
}
