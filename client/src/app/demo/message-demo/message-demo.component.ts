import { Component, ViewEncapsulation } from '@angular/core';
import { MessageComponent } from '../../shared/message';
import { MessageType } from '../../shared/message/message.types';
import { DemoModule, demoProp } from '../shared';

@Component({
  selector: 'app-message-demo',
  standalone: true,
  imports: [DemoModule, MessageComponent],
  templateUrl: './message-demo.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class MessageDemoComponent {
  protected demoState = {
    type: demoProp<MessageType>(['info', 'success', 'danger', 'light']),
    nonclosable: demoProp([false, true]),
    icon: demoProp([undefined, '', 'lightbulb', 'bolt']),
    visible: demoProp([true, false]),
  };
}
