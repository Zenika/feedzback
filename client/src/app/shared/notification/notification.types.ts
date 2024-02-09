export type Notification = {
  message: string;
  type: NotificationType;
};

export type NotificationType = 'info' | 'success' | 'danger';
