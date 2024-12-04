import { Directive, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { FeedbackService } from './feedback.service';

@Directive({
  selector: '[appGiveRequestedFeedback]',
  host: {
    '(click)': 'giveNow()',
  },
})
export class GiveRequestedFeedbackDirective {
  private feedbackService = inject(FeedbackService);

  private router = inject(Router);

  feedbackId = input.required<string>({ alias: 'appGiveRequestedFeedback' });

  giveNow() {
    this.feedbackService
      .revealRequestTokenId(this.feedbackId())
      .subscribe(({ token }) => this.router.navigate(['/give-requested/token', token]));
  }
}
