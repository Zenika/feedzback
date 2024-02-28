import { NgTemplateOutlet } from '@angular/common';
import { Component, TemplateRef, ViewEncapsulation, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { Notification, NotificationMessage, NotificationType } from './notification.types';

@Component({
  selector: 'app-notification',
  host: { class: 'app-notification' },
  standalone: true,
  imports: [NgTemplateOutlet, MatButtonModule, MatIconModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class NotificationComponent {
  protected snackBarRef = inject(MatSnackBarRef);

  data: Notification = inject(MAT_SNACK_BAR_DATA);

  protected iconMap: Record<NotificationType, string> = {
    info: 'info',
    success: 'check_circle',
    danger: 'warning',
  };

  protected isTemplateRef(message: NotificationMessage): message is TemplateRef<unknown> {
    return message instanceof TemplateRef;
  }
}
