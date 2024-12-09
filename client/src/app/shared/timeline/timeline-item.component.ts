import { Component, contentChild, TemplateRef, viewChild } from '@angular/core';
import { TimelineIconDirective } from './timeline-icon.directive';

@Component({
  selector: 'app-timeline-item',
  template: '<ng-template><div><ng-content></ng-content></div></ng-template>',
})
export class TimelineItemComponent {
  contentTemplate = viewChild.required(TemplateRef);

  iconDirective = contentChild(TimelineIconDirective);

  get iconTemplate(): TemplateRef<void> | undefined {
    return this.iconDirective()?.template;
  }
}
