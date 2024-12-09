export * from './timeline-container.component';
export * from './timeline-icon.directive';
export * from './timeline-item.component';
export * from './timeline.token';
export * from './timeline.types';

import { TimelineContainerComponent } from './timeline-container.component';
import { TimelineIconDirective } from './timeline-icon.directive';
import { TimelineItemComponent } from './timeline-item.component';

export const TimelineModule = [TimelineContainerComponent, TimelineIconDirective, TimelineItemComponent] as const;
