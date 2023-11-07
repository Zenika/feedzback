import { NgIf } from '@angular/common';
import { Component, HostBinding, ViewEncapsulation, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthService } from '../shared/auth/auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [NgIf, RouterLink, MatIconModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SignInComponent {
  @HostBinding('class.app-sign-in') hasCss = true;

  @HostBinding('class.gbl-landing') hasLandingCss = true;

  private authService = inject(AuthService);

  protected disabled = false;

  protected signInAsGuest = environment.signInAsGuest;

  signInWithGoogle() {
    this.disabled = true;
    this.authService.signInWithGoogle().subscribe((success) => {
      if (!success) {
        this.disabled = false;
      }
    });
  }
}
