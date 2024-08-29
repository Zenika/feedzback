import { Directive, ElementRef, inject, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appSkipLinksTarget]',
  exportAs: 'appSkipLinksTarget',
  host: {
    '[style.outline]': '"none"',
  },
  standalone: true,
})
export class SkipLinksTargetDirective implements OnDestroy {
  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  private tabIndexObserver = new MutationObserver(() => {
    if (this.elementRef.nativeElement.tabIndex === 0) {
      // Let's call the `focus` method once the `elementRef` is focusable
      this.elementRef.nativeElement.focus({ preventScroll: true });
    }
  });

  constructor() {
    this.tabIndexObserver.observe(this.elementRef.nativeElement, { attributeFilter: ['tabindex'] });
  }

  ngOnDestroy(): void {
    this.tabIndexObserver.disconnect();
  }

  focus() {
    // The `focus` method of the directive, simply makes the `elementRef` temporarily focusable, by setting its `tabindex` attribute.
    // While the `focus` method of the `elementRef.nativeElement` is actually performed in the `MutationObserver` callback.
    this.elementRef.nativeElement.tabIndex = 0;

    // The `elementRef` should not be generally accessible via the TAB key.
    setTimeout(() => this.elementRef.nativeElement.removeAttribute('tabindex'), 500);
  }
}
