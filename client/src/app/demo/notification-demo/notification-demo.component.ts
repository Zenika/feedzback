import { Component, ViewEncapsulation, inject } from '@angular/core';
import { NotificationService } from '../../shared/notification';

@Component({
  selector: 'app-notification-demo',
  standalone: true,
  imports: [],
  templateUrl: './notification-demo.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class NotificationDemoComponent {
  protected notificationService = inject(NotificationService);
}
