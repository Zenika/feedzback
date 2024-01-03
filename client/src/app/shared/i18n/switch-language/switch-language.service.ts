import { DOCUMENT } from '@angular/common';
import { Injectable, LOCALE_ID, inject } from '@angular/core';
import { LocaleId } from './switch-language.types';

@Injectable({
  providedIn: 'root',
})
export class SwitchLanguageService {
  readonly localeId = inject<LocaleId>(LOCALE_ID);

  private document = inject(DOCUMENT);

  switchLanguage() {
    switch (this.localeId) {
      case 'fr': {
        this.setCookie('en', 'US');
        this.document.location.reload();
        break;
      }
      case 'en': {
        this.setCookie('fr', 'FR');
        this.document.location.reload();
        break;
      }
    }
  }

  private setCookie(language: string, country: string) {
    this.document.cookie = `firebase-language-override=${language}; path=/`;
    this.document.cookie = `firebase-country-override=${country}; path=/`;
  }
}
