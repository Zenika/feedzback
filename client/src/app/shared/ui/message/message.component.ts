import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation, booleanAttribute, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MessageType } from './message.types';

@Component({
  selector: 'app-message',
  host: { '[class]': 'getClass()' },
  standalone: true,
  imports: [NgClass, MatIconModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MessageComponent {
  nonclosable = input(false, { transform: booleanAttribute });

  icon = input<string>();

  type = input<MessageType>('light');

  @Input() visible = true;

  @Output() visibleChange = new EventEmitter<boolean>();

  getClass() {
    const css = ['app-message', `app-message--${this.type()}`];
    if (!this.visible) {
      css.push('app-message--hidden');
    }
    return css.join(' ');
  }

  protected iconMap: Record<MessageType, string> = {
    info: 'info',
    success: 'check_circle',
    danger: 'warning',
    light: '',
  };

  close() {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
