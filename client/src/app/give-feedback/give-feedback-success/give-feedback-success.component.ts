import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, HostBinding, ViewEncapsulation, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import confetti from 'canvas-confetti';
import { AuthService } from '../../shared/auth';
import { GiveFeedbackSuccess } from './give-feedback-success.types';

@Component({
  selector: 'app-give-feedback-success',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './give-feedback-success.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class GiveFeedbackSuccessComponent implements AfterViewInit {
  @HostBinding('class.gbl-info') hasGlobalCss = true;

  protected state: GiveFeedbackSuccess = inject(DOCUMENT).defaultView?.history.state;

  private authService = inject(AuthService);

  private router = inject(Router);

  protected signOut() {
    this.authService.signOut().subscribe();
  }

  ngAfterViewInit(): void {
    if (this.state.receiverEmail) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.65 } });
    } else {
      this.router.navigate(['/']);
    }
  }
}
