import { Component, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IconAnimation, IconDirective, IconPull, IconSize } from '../../shared/icon';
import { MessageComponent } from '../../shared/message';
import { DemoModule, demoProp } from '../shared';

@Component({
  selector: 'app-icon-demo',
  imports: [DemoModule, MatIconModule, IconDirective, MessageComponent],
  templateUrl: './icon-demo.component.html',
  styleUrl: './icon-demo.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class IconDemoComponent {
  protected demoState = {
    size: demoProp<IconSize>(
      ['none', '1x', '2x', '3x', '4x', '5x', '6x', '7x', '8x', '9x', '10x', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      { defaultValue: 'lg' },
    ),
    pull: demoProp<IconPull>(['none', 'left', 'right']),
    animation: demoProp<IconAnimation>(['none', 'beat', 'bounce', 'fade', 'flip', 'shake', 'spin']),
  };
}
