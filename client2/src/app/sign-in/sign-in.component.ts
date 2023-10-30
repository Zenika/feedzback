import { Component, HostBinding, ViewEncapsulation, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../shared/auth/auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SignInComponent {
  private authService = inject(AuthService);

  protected disabled = false;

  @HostBinding('class.app-sign-in') hasCss = true;

  signInWithGoogle() {
    this.disabled = true;
    this.authService.signInWithGoogle().subscribe((success) => {
      if (!success) {
        this.disabled = false;
      }
    });
  }
}
