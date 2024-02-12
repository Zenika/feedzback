import { DOCUMENT } from '@angular/common';
import { Component, ViewEncapsulation, inject } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-version',
  host: {
    class: 'app-version',
    '[class.app-version--hover]': 'hover',
    '(mouseover)': 'hover = true',
    '(mouseleave)': 'hover = false',
    '(click)': 'copyToClipboard()',
  },
  standalone: true,
  template: '{{ appVersion }}',
  styles: `
    .app-version {
      cursor: copy;
      z-index: 2;
      position: fixed;
      right: 1.25em;
      bottom: 0.25em;
      line-height: 1em;
      font-size: 0.85rem;
      transform: rotate(90deg);
      transform-origin: right bottom;
      transition: opacity 250ms ease;
      opacity: 0.25;

      &--hover {
        opacity: 1;
      }
    }
  `,
  encapsulation: ViewEncapsulation.None,
})
export class VersionComponent {
  private document = inject(DOCUMENT);

  readonly appVersion = environment.appVersion;

  hover = false;

  copyToClipboard() {
    this.document.defaultView?.navigator.clipboard.writeText(this.appVersion);
  }
}
