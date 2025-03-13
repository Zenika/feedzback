import { Routes } from '@angular/router';
import { unsavedFormGuardFactory } from '../shared/unsaved-form';
import { AvatarDemoComponent } from './avatar-demo/avatar-demo.component';
import { ColorDemoComponent } from './color-demo/color-demo.component';
import { ContentDemoComponent } from './content-demo/content-demo.component';
import { DialogTooltipDemoComponent } from './dialog-tooltip-demo/dialog-tooltip-demo.component';
import { IconDemoComponent } from './icon-demo/icon-demo.component';
import { LandingDemoComponent } from './landing-demo/landing-demo.component';
import { LogoDemoComponent } from './logo-demo/logo-demo.component';
import { MessageDemoComponent } from './message-demo/message-demo.component';
import { NotificationDemoComponent } from './notification-demo/notification-demo.component';
import { ShadowDemoComponent } from './shadow-demo/shadow-demo.component';
import { TimelineDemoComponent } from './timeline-demo/timeline-demo.component';
import { UnsavedFormGuardDemoComponent, unsavedFormGuardDemoDialogData } from './unsaved-form-guard-demo';
import { UnsavedFormStorageDemoComponent } from './unsaved-form-storage-demo/unsaved-form-storage-demo.component';

export const demoRoutes: Routes = [
  { path: 'logo', component: LogoDemoComponent },
  { path: 'avatar', component: AvatarDemoComponent },
  { path: 'color', component: ColorDemoComponent },
  { path: 'content', component: ContentDemoComponent },
  { path: 'shadow', component: ShadowDemoComponent },
  { path: 'dialog-tooltip', component: DialogTooltipDemoComponent },
  { path: 'icon', component: IconDemoComponent },
  { path: 'message', component: MessageDemoComponent },
  { path: 'notification', component: NotificationDemoComponent },
  { path: 'timeline', component: TimelineDemoComponent },
  { path: 'landing', component: LandingDemoComponent },
  {
    path: 'unsaved-form-guard',
    component: UnsavedFormGuardDemoComponent,
    canDeactivate: [unsavedFormGuardFactory(unsavedFormGuardDemoDialogData)],
  },
  { path: 'unsaved-form-storage', component: UnsavedFormStorageDemoComponent },
];

export const demoPaths = demoRoutes.map(({ path }) => path as string);
