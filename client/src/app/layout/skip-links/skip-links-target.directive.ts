import { Directive } from '@angular/core';
import { SKIP_LINKS_TARGET_ID } from './skip-links.constants';

@Directive({
  selector: '[appSkipLinksTarget]',
  exportAs: 'appSkipLinksTarget',
  host: {
    id: SKIP_LINKS_TARGET_ID,
    tabindex: '0',
    //'[style.outline]': '"none"',
  },
  standalone: true,
})
export class SkipLinksTargetDirective {}
