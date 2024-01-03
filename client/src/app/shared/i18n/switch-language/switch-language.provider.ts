import { APP_INITIALIZER, FactoryProvider, LOCALE_ID } from '@angular/core';
import Cookies from 'js-cookie';
import { LOCALE_ID_COOKIE_KEY } from './switch-language.config';
import { LocaleId } from './switch-language.types';

export const provideSwitchLanguage = (): FactoryProvider => ({
  provide: APP_INITIALIZER,
  useFactory: (localId: LocaleId) => (): Promise<void> => {
    Cookies.set(LOCALE_ID_COOKIE_KEY, localId, { expires: 365 });
    return Promise.resolve();
  },
  deps: [LOCALE_ID],
  multi: true,
});
