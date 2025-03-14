import { Component, TemplateRef, ViewEncapsulation, inject, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../environments/environment';
import { AuthService } from '../shared/auth';
import { LogoZenikaComponent } from '../shared/logo-zenika';
import { NotificationService } from '../shared/notification';
import { CredentialsDialogComponent } from './credentials-dialog/credentials-dialog.component';

@Component({
  selector: 'app-sign-in',
  imports: [MatButtonModule, MatIconModule, LogoZenikaComponent, CredentialsDialogComponent],
  templateUrl: './sign-in.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class SignInComponent {
  private authService = inject(AuthService);

  private notificationService = inject(NotificationService);

  protected readonly withGoogleEnabled = !environment.firebaseEmulatorMode;

  protected readonly withEmailAndPasswordEnabled =
    environment.firebaseEmulatorMode || environment.alias === 'dev-local' || environment.alias === 'dev-remote';

  private dialog = inject(MatDialog);

  private credentialsDialogRef?: MatDialogRef<unknown>;

  protected credentialsDialogTemplate = viewChild<TemplateRef<unknown>>('credentialsDialogTemplate');

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
      } else {
        this.credentialsDialogRef?.close();
      }
    });
  }

  private showError() {
    this.notificationService
      .show($localize`:@@Component.SignIn.ErrorMessage:L'identification a échoué`, 'danger')
      ._dismissAfter(4000);
  }

  protected openCredentialsDialog() {
    const credentialsDialogTemplate = this.credentialsDialogTemplate();
    if (credentialsDialogTemplate) {
      this.credentialsDialogRef = this.dialog.open(credentialsDialogTemplate, { width: '360px' });
    }
  }
}
