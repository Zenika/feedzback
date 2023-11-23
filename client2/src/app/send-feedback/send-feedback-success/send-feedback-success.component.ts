import { DOCUMENT } from '@angular/common';
import { Component, HostBinding, ViewEncapsulation, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../shared/auth/auth.service';
import { SendFeedbackSuccess } from './send-feedback-success.types';

@Component({
  selector: 'app-send-feedback-success',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './send-feedback-success.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class SendFeedbackSuccessComponent {
  @HostBinding('class.gbl-info') hasGlobalCss = true;

  protected state: SendFeedbackSuccess = inject(DOCUMENT).defaultView?.history.state;

  private authService = inject(AuthService);

  protected signOut() {
    this.authService.signOut().subscribe();
  }
}
