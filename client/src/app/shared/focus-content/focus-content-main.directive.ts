import { Directive, ElementRef, inject } from '@angular/core';
import { FocusContentService } from './focus-content.service';

@Directive({
  selector: '[appFocusContentMain]',
  host: { '[tabIndex]': '-1' },
})
export class FocusContentMainDirective {
  constructor() {
    inject(FocusContentService).mainElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  }
}
