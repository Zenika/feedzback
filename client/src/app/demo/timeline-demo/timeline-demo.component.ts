import { Component, signal, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TimelineDirection, TimelineLineSize, TimelineModule } from '../../shared/timeline';
import { DemoModule, demoProp } from '../shared';

@Component({
  selector: 'app-timeline-demo',
  imports: [MatButtonModule, TimelineModule, DemoModule],
  templateUrl: './timeline-demo.component.html',
  styleUrl: './timeline-demo.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class TimelineDemoComponent {
  protected demoState = {
    pendingFromIndex: demoProp([undefined, 0, 1, 2]), // note: the index `3` is equivalent to `undefined`.
    bulletPoints: demoProp([false, true]),
    lineSize: demoProp<TimelineLineSize>([{}, { horizontal: 15, vertical: 3 }]),
    reverse: demoProp([false, true]),
    vertical: demoProp([false, true]),
    verticalContentSize: demoProp([undefined, 20]),
    breakpoint: demoProp([false, true, '576']),
    fontSize: demoProp([undefined, '1.5rem', '2rem']),
  };

  protected items = [
    'Lorem ipsum dolor sit amet',
    'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium',
    'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit',
  ];

  protected directionDemo1 = signal<TimelineDirection | undefined>(undefined);

  protected directionDemo2 = signal<TimelineDirection | undefined>(undefined);

  protected updateContent = signal(false);

  protected toggleUpdateContent() {
    this.updateContent.update((value) => !value);
  }
}
