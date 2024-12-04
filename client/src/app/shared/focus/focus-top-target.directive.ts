import { Directive, ElementRef, inject } from '@angular/core';
import { FocusService } from './focus.service';

@Directive({
  selector: '[appFocusTopTarget]',
  host: { '[tabIndex]': '-1' },
})
export class FocusTopTargetDirective {
  constructor() {
    inject(FocusService).topTarget = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  }
}
