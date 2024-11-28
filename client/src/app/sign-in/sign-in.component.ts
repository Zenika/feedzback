import { Component, ViewEncapsulation, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../environments/environment';
import { AuthService } from '../shared/auth';
import { DividerComponent } from '../shared/divider';
import { NotificationService } from '../shared/notification';
import { ZenikaLogoComponent } from '../shared/zenika-logo';
import { CredentialsComponent } from './credentials/credentials.component';

@Component({
  selector: 'app-sign-in',
  host: { class: 'gbl-landing' },
  imports: [MatIconModule, DividerComponent, ZenikaLogoComponent, CredentialsComponent],
  templateUrl: './sign-in.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class SignInComponent {
  private authService = inject(AuthService);

  private notificationService = inject(NotificationService);

  protected readonly withGoogleEnabled = !environment.firebaseEmulatorMode;

  protected readonly withEmailAndPasswordEnabled =
    environment.firebaseEmulatorMode || environment.alias === 'dev-local' || environment.alias === 'dev-remote';

  protected disabled = signal(false);

  protected signInWithGoogle() {
    this.disabled.set(true);
    this.authService.signInWithGoogle().subscribe((success) => {
      if (!success) {
        this.disabled.set(false);
        this.showError();
      }
    });
  }

  protected signInWithEmailAndPassword(email: string, password: string) {
    this.disabled.set(true);
    this.authService.signInWithEmailAndPassword(email!, password!).subscribe((success) => {
      if (!success) {
        this.disabled.set(false);
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
