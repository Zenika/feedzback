import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from '../shared/notification/notification.service';
import { AvatarComponent } from '../shared/ui/avatar/avatar.component';
import { DialogTooltipDirective } from '../shared/ui/dialog-tooltip/dialog-tooltip.directive';
import { MessageComponent } from '../shared/ui/message/message.component';

@Component({
  selector: 'app-demo-content',
  standalone: true,
  imports: [MessageComponent, AvatarComponent, MatIconModule, DialogTooltipDirective],
  templateUrl: './demo-content.component.html',
})
export default class DemoContentComponent {
  loremIpsum = 'Lorem ipsum';

  protected notificationService = inject(NotificationService);
}
