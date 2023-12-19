import { NgClass } from '@angular/common';
import { Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MessageType } from './message.types';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [NgClass, MatIconModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MessageComponent {
  @Input() type: MessageType = 'light';

  @Input() icon?: string;

  @HostBinding('class') get css() {
    return `app-message app-message--${this.type}`;
  }

  protected iconMap: Record<MessageType, string> = {
    info: 'info',
    success: 'check_circle',
    danger: 'error',
    light: '',
  };
}
