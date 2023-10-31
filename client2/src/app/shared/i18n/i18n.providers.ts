// For a dynamic solution, see: https://github.com/angular/angular/issues/15039#issuecomment-494821739

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID } from '@angular/core';

registerLocaleData(localeFr);

export const provideI18n = () => [
  { provide: LOCALE_ID, useValue: 'fr' },
  { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' },
];
