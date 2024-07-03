import { NgClass } from '@angular/common';
import { Component, ViewEncapsulation, booleanAttribute, computed, input, model } from '@angular/core';
import { IconModule } from '../icon';
import { MessageType } from './message.types';

@Component({
  selector: 'app-message',
  host: { '[class]': 'hostClass()' },
  standalone: true,
  imports: [NgClass, IconModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MessageComponent {
  nonclosable = input(false, { transform: booleanAttribute });

  icon = input<string>();

  type = input<MessageType>('light');

  visible = model(true);

  hostClass = computed(() => {
    const css = ['app-message', `app-message--${this.type()}`];
    if (!this.visible()) {
      css.push('app-message--hidden');
    }
    return css.join(' ');
  });

  protected iconMap: Record<MessageType, string> = {
    info: 'info',
    success: 'check_circle',
    danger: 'warning',
    light: '',
  };

  close() {
    this.visible.set(false);
  }
}
