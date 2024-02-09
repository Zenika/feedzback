import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from './notification.component';
import { Notification, NotificationType } from './notification.types';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private matSnackBar = inject(MatSnackBar);

  readonly DURATION = 5000;

  show(message: string, type: NotificationType = 'info') {
    const data: Notification = { message, type };
    this.matSnackBar.openFromComponent(NotificationComponent, { data, duration: this.DURATION });
  }

  showError() {
    this.show($localize`:@@Message.ErrorOccured:Une erreur s'est produite.`, 'danger');
  }
}
