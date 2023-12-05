import { DatePipe } from '@angular/common';
import { Component, HostBinding, Input, ViewEncapsulation, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AllowedEmailDomainsPipe } from '../../form/allowed-email-domains';
import { FeedbackService } from '../feedback.service';
import { AskedFeedback, FeedbackType } from '../feedback.types';

@Component({
  selector: 'app-asked-feedback',
  standalone: true,
  imports: [DatePipe, MatButtonModule, MatIconModule, AllowedEmailDomainsPipe],
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

  private feedbackService = inject(FeedbackService);

  private router = inject(Router);

  protected giveNow() {
    this.feedbackService
      .revealTokenId(this.feedback.id)
      .subscribe(({ token }) => this.router.navigate(['/send'], { queryParams: { token } }));
  }
}
