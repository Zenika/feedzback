import { Component, ViewEncapsulation } from '@angular/core';
import { DemoModule, demoProp } from '../shared';

@Component({
  selector: 'app-shadow-demo',
  imports: [DemoModule],
  templateUrl: './shadow-demo.component.html',
  styleUrl: './shadow-demo.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ShadowDemoComponent {
  protected demoState = {
    level: demoProp(['0', '1', '2', '3', '4', '5']),
    border: demoProp([true, false]),
  };
}
