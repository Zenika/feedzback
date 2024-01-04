import { APP_BASE_HREF, DOCUMENT } from '@angular/common';
import { Injectable, LOCALE_ID, inject } from '@angular/core';
import Cookies from 'js-cookie';
import { LOCALE_ID_COOKIE_KEY } from './switch-language.config';
import { AppBaseHref, LocaleId } from './switch-language.types';

@Injectable({
  providedIn: 'root',
})
export class SwitchLanguageService {
  readonly localeId = inject<LocaleId>(LOCALE_ID);

  readonly appBaseHref = inject<AppBaseHref>(APP_BASE_HREF);

  private document = inject(DOCUMENT);

  async init(): Promise<void> {
    this.setCookie(this.localeId);
  }

  switchLanguage() {
    switch (this.localeId) {
      case 'fr': {
        this.setCookie('en');
        this.switchApp('/en/');
        break;
      }
      case 'en': {
        this.setCookie('fr');
        this.switchApp('/fr/');
        break;
      }
    }
  }

  private setCookie(localeId: LocaleId) {
    Cookies.set(LOCALE_ID_COOKIE_KEY, localeId, { expires: 365 });
  }

  private switchApp(newAppBaseHref: AppBaseHref) {
    if (this.appBaseHref === '/') {
      console.warn('Localization is not supported in this environment.');
      return;
    }
    const url = new URL(this.document.location.href);
    url.pathname = url.pathname.replace(new RegExp(`^${this.appBaseHref}`), newAppBaseHref);
    this.document.location.assign(url);
  }
}
