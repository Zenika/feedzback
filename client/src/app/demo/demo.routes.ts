import { Routes } from '@angular/router';
import { AvatarDemoComponent } from './avatar-demo/avatar-demo.component';
import { ColorDemoComponent } from './color-demo/color-demo.component';
import { ContentDemoComponent } from './content-demo/content-demo.component';
import { DemoComponent } from './demo.component';
import { DialogTooltipDemoComponent } from './dialog-tooltip-demo/dialog-tooltip-demo.component';
import { IconDemoComponent } from './icon-demo/icon-demo.component';
import { MessageDemoComponent } from './message-demo/message-demo.component';
import { NotificationDemoComponent } from './notification-demo/notification-demo.component';

export default [
  {
    path: '',
    component: DemoComponent,
    children: [
      { path: 'avatar', component: AvatarDemoComponent },
      { path: 'color', component: ColorDemoComponent },
      { path: 'content', component: ContentDemoComponent },
      { path: 'dialog-tooltip', component: DialogTooltipDemoComponent },
      { path: 'icon', component: IconDemoComponent },
      { path: 'message', component: MessageDemoComponent },
      { path: 'notification', component: NotificationDemoComponent },
    ],
  },
] satisfies Routes;
