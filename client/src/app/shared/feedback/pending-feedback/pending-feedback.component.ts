import { DatePipe } from '@angular/common';
import { Component, Input, ViewEncapsulation, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MessageComponent } from '../../ui/message';
import { AllowedEmailDomainsPipe } from '../../validation/allowed-email-domains';
import { FeedbackBodyComponent } from '../feedback-body/feedback-body.component';
import { FeedbackService } from '../feedback.service';
import { FeedbackRequest, FeedbackType } from '../feedback.types';
import { GiveRequestedFeedbackDirective } from '../give-requested-feedback.directive';

@Component({
  selector: 'app-pending-feedback',
  host: { class: 'app-pending-feedback' },
  standalone: true,
  imports: [
    DatePipe,
    MatButtonModule,
    MatIconModule,
    AllowedEmailDomainsPipe,
    MessageComponent,
    FeedbackBodyComponent,
    GiveRequestedFeedbackDirective,
  ],
  templateUrl: './pending-feedback.component.html',
  styleUrl: './pending-feedback.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class PendingFeedbackComponent {
  @Input({ required: true }) feedback!: FeedbackRequest;

  @Input({ required: true }) type!: FeedbackType;

  protected feedbackType = FeedbackType;

  protected getColleagueEmail(feedback: FeedbackRequest): string | undefined {
    return this.type === this.feedbackType.sentRequest ? feedback.giverEmail : feedback.receiverEmail;
  }

  private feedbackService = inject(FeedbackService);

  protected showRequestAgainSuccess = false;

  protected requestAgain() {
    this.feedbackService.requestAgain(this.feedback.id).subscribe(() => (this.showRequestAgainSuccess = true));
  }
}
