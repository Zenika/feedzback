import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from '../shared/notification/notification.service';
import { AvatarComponent } from '../shared/ui/avatar/avatar.component';
import { DialogTooltipDirective } from '../shared/ui/dialog-tooltip';
import { MessageComponent } from '../shared/ui/message';

@Component({
  selector: 'app-demo-content',
  standalone: true,
  imports: [MessageComponent, AvatarComponent, ReactiveFormsModule, MatIconModule, DialogTooltipDirective],
  templateUrl: './demo-content.component.html',
  styleUrl: './demo-content.component.scss',
})
export default class DemoContentComponent {
  protected notificationService = inject(NotificationService);

  loremIpsum = 'Lorem ipsum';

  // Learn more about Material color roles: https://m3.material.io/styles/color/roles
  materialColorRoles = [
    /* primary */
    'primary',
    'on-primary',
    'primary-container',
    'on-primary-container',
    'primary-fixed',
    'primary-fixed-dim',
    'on-primary-fixed',
    'on-primary-fixed-variant',
    /* secondary */
    'secondary',
    'on-secondary',
    'secondary-container',
    'on-secondary-container',
    'secondary-fixed',
    'secondary-fixed-dim',
    'on-secondary-fixed',
    'on-secondary-fixed-variant',
    /* tertiary */
    'tertiary',
    'on-tertiary',
    'tertiary-container',
    'on-tertiary-container',
    'tertiary-fixed',
    'tertiary-fixed-dim',
    'on-tertiary-fixed',
    'on-tertiary-fixed-variant',
    /* error */
    'error',
    'on-error',
    'error-container',
    'on-error-container',
    /* surface */
    'surface-dim',
    'surface',
    'surface-bright',
    'surface-container-lowest',
    'surface-container-low',
    'surface-container',
    'surface-container-high',
    'surface-container-highest',
    'on-surface',
    'on-surface-variant',
    /* outline */
    'outline',
    'outline-variant',
    /* inverse */
    'inverse-surface',
    'inverse-on-surface',
    'inverse-primary',
    /* others */
    'scrim',
    'shadow',
  ];
}
