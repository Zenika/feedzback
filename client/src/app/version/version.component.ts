import { DOCUMENT } from '@angular/common';
import { Component, ViewEncapsulation, inject } from '@angular/core';
import { VersionService } from './version.service';

@Component({
  selector: 'app-version',
  host: {
    class: 'app-version',
    '[class.app-version--hover]': 'hover',
    '(mouseover)': 'hover = true',
    '(mouseleave)': 'hover = false',
    '(click)': 'toClipboard()',
  },
  standalone: true,
  template: '{{ clientAppVersion }}',
  styleUrl: './version.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class VersionComponent {
  private document = inject(DOCUMENT);

  readonly clientAppVersion = inject(VersionService).clientAppVersion;

  hover = false;

  toClipboard() {
    this.document.defaultView?.navigator.clipboard.writeText(this.clientAppVersion);
  }
}
