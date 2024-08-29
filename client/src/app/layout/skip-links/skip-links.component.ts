import { DOCUMENT } from '@angular/common';
import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SKIP_LINKS_TARGET_ID } from './skip-links.constants';

@Component({
  selector: 'app-skip-links',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './skip-links.component.html',
  styleUrls: ['./skip-links.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SkipLinksComponent {
  #document = inject(DOCUMENT);

  focusTarget() {
    this.#document.getElementById(SKIP_LINKS_TARGET_ID)!.focus({ preventScroll: true });
  }
}
