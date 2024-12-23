import { Directive, ElementRef, inject } from '@angular/core';
import { FocusContentService } from './focus-content.service';

@Directive({
  selector: '[appFocusContentTop]',
  host: { '[tabIndex]': '-1' },
})
export class FocusContentTopDirective {
  constructor() {
    inject(FocusContentService).topElement = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  }
}
