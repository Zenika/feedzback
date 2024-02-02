import { NgClass } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  ViewEncapsulation,
  booleanAttribute,
} from '@angular/core';
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
  @Input({ transform: booleanAttribute }) closable = true;

  @Input() icon?: string;

  @Input() type: MessageType = 'light';

  @Input() visible = true;

  @Output() visibleChange = new EventEmitter<boolean>();

  @HostBinding('class') get css() {
    return `app-message app-message--${this.type}`;
  }

  @HostBinding('class.app-message--hidden') get hidden() {
    return !this.visible;
  }

  protected iconMap: Record<MessageType, string> = {
    info: 'info',
    success: 'check_circle',
    danger: 'error',
    light: '',
  };

  close() {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
