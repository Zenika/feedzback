import { Component, ViewEncapsulation, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthService } from '../shared/auth';
import { NotificationService } from '../shared/notification';
import { ZenikaLogoComponent } from '../shared/zenika-logo';

@Component({
  selector: 'app-sign-in',
  host: { class: 'app-sign-in gbl-landing' },
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ZenikaLogoComponent,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SignInComponent {
  private authService = inject(AuthService);

  private notificationService = inject(NotificationService);

  protected method: 'emailAndPassword' | 'google' = environment.FIREBASE_EMULATORS ? 'emailAndPassword' : 'google';

  protected form = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  protected disabled = false;

  protected signInWithGoogle() {
    this.disabled = true;
    this.authService.signInWithGoogle().subscribe((success) => {
      if (!success) {
        this.disabled = false;
        this.showError();
      }
    });
  }

  protected signInWithEmailAndPassword() {
    if (this.form.invalid) {
      return;
    }
    const { email, password } = this.form.value;

    this.disabled = true;
    this.authService.signInWithEmailAndPassword(email!, password!).subscribe((success) => {
      if (!success) {
        this.disabled = false;
        this.showError();
      }
    });
  }

  private showError() {
    this.notificationService
      .show($localize`:@@Component.SignIn.ErrorMessage:L'identification a échoué`, 'danger')
      ._dismissAfter(4000);
  }
}
