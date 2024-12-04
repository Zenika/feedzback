import { NgIf } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { TimelineLineSize, TimelineModule } from '../../shared/timeline';
import { DemoModule, demoProp } from '../shared';

@Component({
  selector: 'app-timeline-demo',
  imports: [NgIf, DemoModule, TimelineModule],
  templateUrl: './timeline-demo.component.html',
  styleUrl: './timeline-demo.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class TimelineDemoComponent {
  demoState = {
    pendingFromIndex: demoProp([undefined, 0, 1, 2]),
    bulletPoints: demoProp([false, true]),
    lineSize: demoProp<TimelineLineSize>([{}, { horizontal: 15, vertical: 3 }]),
    reverse: demoProp([false, true]),
    vertical: demoProp([false, true]),
    verticalContentSize: demoProp([undefined, 20]),
    breakpoint: demoProp([false, true, '768px']),
    fontSize: demoProp([undefined, '1.5rem', '2rem']),
  };

  items = [
    'Lorem ipsum dolor sit amet',
    'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium',
    'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit',
  ];

  updateHtml = false;
}
