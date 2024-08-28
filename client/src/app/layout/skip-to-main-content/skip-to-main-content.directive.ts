import { Directive } from '@angular/core';
import { SKIP_TO_MAIN_CONTENT_ID } from './skip-to-main-content.constants';

@Directive({
  selector: '[appSkipToMainContent]',
  host: {
    id: SKIP_TO_MAIN_CONTENT_ID,
    tabindex: '0',
    '[style.outline]': '"none"',
  },
  standalone: true,
})
export class SkipToMainContentDirective {}
