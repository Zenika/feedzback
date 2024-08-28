import { DOCUMENT } from '@angular/common';
import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SKIP_TO_MAIN_CONTENT_ID } from './skip-to-main-content.constants';

@Component({
  selector: 'app-skip-to-main-content',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './skip-to-main-content.component.html',
  styleUrls: ['./skip-to-main-content.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SkipToMainContentComponent {
  #document = inject(DOCUMENT);

  focusMainContent() {
    this.#document.getElementById(SKIP_TO_MAIN_CONTENT_ID)!.focus({ preventScroll: true });
  }
}
