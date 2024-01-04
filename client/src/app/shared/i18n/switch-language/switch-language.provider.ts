import { APP_INITIALIZER, FactoryProvider } from '@angular/core';
import { SwitchLanguageService } from './switch-language.service';

export const provideSwitchLanguage = (): FactoryProvider => ({
  provide: APP_INITIALIZER,
  useFactory: (switchLanguageService: SwitchLanguageService) => (): Promise<void> => switchLanguageService.init(),
  deps: [SwitchLanguageService],
  multi: true,
});
