import { Directive, HostListener, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FeedbackService } from './feedback.service';

@Directive({
  selector: '[appGiveRequestedFeedback]',
  standalone: true,
})
export class GiveRequestedFeedbackDirective {
  @Input({ required: true }) appGiveRequestedFeedback!: string;

  @HostListener('click') giveNow() {
    this.feedbackService
      .revealRequestTokenId(this.appGiveRequestedFeedback)
      .subscribe(({ token }) => this.router.navigate(['/give-requested/token', token]));
  }

  private feedbackService = inject(FeedbackService);

  private router = inject(Router);
}
