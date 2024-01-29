import { Component } from '@angular/core';
import { AvatarComponent } from '../shared/ui/avatar/avatar.component';
import { MessageComponent } from '../shared/ui/message/message.component';

@Component({
  selector: 'app-demo-content',
  standalone: true,
  imports: [MessageComponent, AvatarComponent],
  templateUrl: './demo-content.component.html',
})
export default class DemoContentComponent {
  loremIpsum = 'Lorem ipsum';
}
