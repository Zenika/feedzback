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
    'background',
    'error',
    'error-container',
    'inverse-on-surface',
    'inverse-primary',
    'inverse-surface',
    'on-background',
    'on-error',
    'on-error-container',
    'on-primary',
    'on-primary-container',
    'on-primary-fixed',
    'on-primary-fixed-variant',
    'on-secondary',
    'on-secondary-container',
    'on-secondary-fixed',
    'on-secondary-fixed-variant',
    'on-surface',
    'on-surface-variant',
    'on-tertiary',
    'on-tertiary-container',
    'on-tertiary-fixed',
    'on-tertiary-fixed-variant',
    'outline',
    'outline-variant',
    'primary',
    'primary-container',
    'primary-fixed',
    'primary-fixed-dim',
    'scrim',
    'secondary',
    'secondary-container',
    'secondary-fixed',
    'secondary-fixed-dim',
    'shadow',
    'surface',
    'surface-bright',
    'surface-container',
    'surface-container-high',
    'surface-container-highest',
    'surface-container-low',
    'surface-container-lowest',
    'surface-dim',
    'surface-tint',
    'surface-variant',
    'tertiary',
    'tertiary-container',
    'tertiary-fixed',
    'tertiary-fixed-dim',
  ];
}
