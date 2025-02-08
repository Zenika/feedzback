import { DOCUMENT } from '@angular/common';
import { Component, ViewEncapsulation, afterNextRender, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import confetti from 'canvas-confetti';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../shared/auth';
import { GiveFeedbackSuccess } from './give-feedback-success.types';

@Component({
  selector: 'app-give-feedback-success',
  host: { class: 'gbl-info' },
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './give-feedback-success.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class GiveFeedbackSuccessComponent {
  protected state: GiveFeedbackSuccess = inject(DOCUMENT).defaultView?.history.state;

  private authService = inject(AuthService);

  private router = inject(Router);

  // Firebase emulator mode is used for e2e tests.
  // Therefore, we want to disable the confetti in this environment because it degrades Playwright screenshots.
  private hasConfetti = !environment.firebaseEmulatorMode;

  constructor() {
    afterNextRender(() => this.checkState());
  }

  protected signOut() {
    this.authService.signOut().subscribe();
  }

  private checkState() {
    if (!this.state.receiverEmail) {
      this.router.navigate(['/']);
    } else if (this.hasConfetti) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.65 } });
    }
  }
}
