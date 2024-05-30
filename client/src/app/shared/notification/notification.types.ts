import { TemplateRef } from '@angular/core';

export interface Notification {
  message: NotificationMessage;
  type: NotificationType;
}

export type NotificationMessage = string | TemplateRef<unknown>;

export type NotificationType = 'info' | 'success' | 'danger';
