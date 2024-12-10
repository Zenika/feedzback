import { Directive, ElementRef, inject } from '@angular/core';
import { FocusService } from './focus.service';

@Directive({
  selector: '[appFocusMainTarget]',
  host: { '[tabIndex]': '-1' },
})
export class FocusMainDirective {
  constructor() {
    inject(FocusService).mainTarget = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  }
}