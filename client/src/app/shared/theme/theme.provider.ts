import { APP_INITIALIZER, FactoryProvider } from '@angular/core';
import { ThemeService } from './theme.service';

export const provideTheme = (): FactoryProvider => ({
  provide: APP_INITIALIZER,
  useFactory: () => () => {
    // Note: all we need is for Angular to instantiate the ThemeService as soon as possible to restore the stored theme.
  },
  deps: [ThemeService],
  multi: true,
});
