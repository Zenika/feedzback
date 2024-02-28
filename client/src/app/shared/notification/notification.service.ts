import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from './notification.component';
import { Notification, NotificationMessage, NotificationType } from './notification.types';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private matSnackBar = inject(MatSnackBar);

  readonly DURATION = 7000;

  show(message: NotificationMessage, type: NotificationType = 'info') {
    const data: Notification = { message, type };
    return this.matSnackBar.openFromComponent(NotificationComponent, { data, duration: this.DURATION });
  }

  showError() {
    return this.show($localize`:@@Message.ErrorOccured:Une erreur s'est produite.`, 'danger');
  }
}
