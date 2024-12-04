import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appTimelineIcon]',
})
export class TimelineIconDirective {
  template: TemplateRef<void> = inject(TemplateRef);
}
