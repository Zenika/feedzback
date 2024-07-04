import { Component, ViewEncapsulation, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AuthService } from '../shared/auth';
import { LandingDirective } from '../shared/landing';
import { ZenikaLogoComponent } from '../shared/zenika-logo';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  hostDirectives: [LandingDirective],
  imports: [RouterLink, MatIconModule, ZenikaLogoComponent],
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
