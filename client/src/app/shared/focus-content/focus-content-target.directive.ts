import { Directive, ElementRef, inject } from '@angular/core';
import { FocusContentService } from './focus-content.service';

@Directive({
  selector: '[appFocusContentTarget]',
  host: {
    '[tabIndex]': '-1',
  },
})
export class FocusContentTargetDirective {
  constructor() {
    inject(FocusContentService).targetElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  }
}
