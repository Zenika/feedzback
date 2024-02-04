import { Component, ViewEncapsulation, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AuthService } from '../shared/auth';

@Component({
  selector: 'app-sign-in',
  host: { class: 'gbl-landing' },
  standalone: true,
  imports: [RouterLink, MatIconModule],
  templateUrl: './sign-in.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class SignInComponent {
  private authService = inject(AuthService);

  protected disabled = false;

  signInWithGoogle() {
    this.disabled = true;
    this.authService.signInWithGoogle().subscribe((success) => {
      if (!success) {
        this.disabled = false;
      }
    });
  }
}
