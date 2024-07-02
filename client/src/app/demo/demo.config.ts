import { Routes } from '@angular/router';
import { AvatarDemoComponent } from './avatar-demo/avatar-demo.component';
import { ColorDemoComponent } from './color-demo/color-demo.component';
import { ContentDemoComponent } from './content-demo/content-demo.component';
import { DialogTooltipDemoComponent } from './dialog-tooltip-demo/dialog-tooltip-demo.component';
import { IconDemoComponent } from './icon-demo/icon-demo.component';
import { MessageDemoComponent } from './message-demo/message-demo.component';
import { NotificationDemoComponent } from './notification-demo/notification-demo.component';

export const demoRoutes: Routes = [
  { path: 'avatar', component: AvatarDemoComponent },
  { path: 'color', component: ColorDemoComponent },
  { path: 'content', component: ContentDemoComponent },
  { path: 'dialog-tooltip', component: DialogTooltipDemoComponent },
  { path: 'icon', component: IconDemoComponent },
  { path: 'message', component: MessageDemoComponent },
  { path: 'notification', component: NotificationDemoComponent },
];

export const demoPaths = demoRoutes.map(({ path }) => path as string);
