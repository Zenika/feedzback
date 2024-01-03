import { APP_BASE_HREF, DOCUMENT } from '@angular/common';
import { Injectable, LOCALE_ID, inject } from '@angular/core';
import Cookies from 'js-cookie';
import { LOCALE_ID_COOKIE_KEY } from './switch-language.config';
import { AppBaseHref, LocaleId } from './switch-language.types';

@Injectable({
  providedIn: 'root',
})
export class SwitchLanguageService {
  readonly appBaseHref = inject<AppBaseHref>(APP_BASE_HREF);

  readonly localeId = inject<LocaleId>(LOCALE_ID);

  private document = inject(DOCUMENT);

  switchLanguage() {
    switch (this.localeId) {
      case 'fr': {
        Cookies.set(LOCALE_ID_COOKIE_KEY, 'en' satisfies LocaleId, { expires: 365 });
        this.navigateTo('/en/');
        break;
      }
      case 'en': {
        Cookies.set(LOCALE_ID_COOKIE_KEY, 'fr' satisfies LocaleId, { expires: 365 });
        this.navigateTo('/fr/');
        break;
      }
    }
  }

  private navigateTo(newAppBaseHref: AppBaseHref) {
    if (this.appBaseHref === '/') {
      console.warn('Localization is not supported in this environment');
      return;
    }
    this.document.location.assign(newAppBaseHref);
  }
}
