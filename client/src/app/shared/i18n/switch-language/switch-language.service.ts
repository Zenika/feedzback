import { APP_BASE_HREF } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { AppBaseHref, AppLanguage } from './switch-language.types';
import { mapBaseHrefToLanguage } from './switch-language.utils';

@Injectable({
  providedIn: 'root',
})
export class SwitchLanguageService {
  readonly currentLanguage: AppLanguage = mapBaseHrefToLanguage(inject(APP_BASE_HREF) as AppBaseHref);

  switchLanguage() {
    switch (this.currentLanguage) {
      case 'fr': {
        this.setCookie('en', 'US');
        this.assignLocation('/en/');
        break;
      }
      case 'en': {
        this.setCookie('fr', 'FR');
        this.assignLocation('/fr/');
        break;
      }
    }
  }

  private setCookie(language: string, country: string) {
    document.cookie = `firebase-language-override=${language}; path=/`;
    document.cookie = `firebase-country-override=${country}; path=/`;
  }

  private assignLocation(appBaseHref: AppBaseHref) {
    document.location.assign(appBaseHref);
  }
}
