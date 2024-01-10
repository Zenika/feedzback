import { Component, HostBinding, ViewEncapsulation, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AuthService } from '../shared/auth';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  templateUrl: './sign-in.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class SignInComponent {
  @HostBinding('class.app-sign-in') hasCss = true;

  @HostBinding('class.gbl-landing') hasGlobalCss = true;

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
