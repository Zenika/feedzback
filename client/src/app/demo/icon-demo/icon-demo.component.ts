import { Component, ViewEncapsulation } from '@angular/core';
import { IconAnimation, IconModule, IconPull, IconSize } from '../../shared/icon';
import { DemoModule, demoProp } from '../shared';

@Component({
  selector: 'app-icon-demo',
  standalone: true,
  imports: [DemoModule, IconModule],
  templateUrl: './icon-demo.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class IconDemoComponent {
  protected demoState = {
    size: demoProp<IconSize>(
      ['none', '1x', '2x', '3x', '4x', '5x', '6x', '7x', '8x', '9x', '10x', '2xs', 'xs', 'sm', 'lg', 'xl', '2xl'],
      { defaultValue: 'xl' },
    ),
    pull: demoProp<IconPull>(['none', 'left', 'right']),
    animation: demoProp<IconAnimation>(['none', 'beat', 'bounce', 'fade', 'flip', 'shake', 'spin']),
  };
}
