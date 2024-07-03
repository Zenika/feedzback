import { Component, ViewEncapsulation } from '@angular/core';
import { AvatarComponent } from '../../shared/avatar';
import { DemoModule, demoProp } from '../shared';

@Component({
  selector: 'app-avatar-demo',
  standalone: true,
  imports: [DemoModule, AvatarComponent],
  templateUrl: './avatar-demo.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AvatarDemoComponent {
  protected demoState = {
    small: demoProp([false, true]),
  };
}
