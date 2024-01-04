import { APP_INITIALIZER, FactoryProvider } from '@angular/core';
import { LanguageService } from './language.service';

export const provideLanguage = (): FactoryProvider => ({
  provide: APP_INITIALIZER,
  useFactory: (languageService: LanguageService) => (): Promise<void> => languageService.init(),
  deps: [LanguageService],
  multi: true,
});
