import { APP_BASE_HREF } from '@angular/common';
import { DOCUMENT, Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PreRequestFeedbackService {
  private document = inject(DOCUMENT);

  private appBaseHref = inject(APP_BASE_HREF);

  buildMagicLink(token: string) {
    // IMPORTANT NOTE:
    // The magic link does not contain the locale.
    // The redirection to `/fr` or `/en` occurs when the colleague visits the magic link page (see `src/404.html` for details).
    // However, since this redirection is not functional in the `dev-local` environment, the locale is explicitly added only in this case.
    const locale = environment.alias === 'dev-local' ? this.appBaseHref : '/';

    return `${this.document.location.origin}${locale}pre-request/token/${token}`;
  }
}
