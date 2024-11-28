import { inject, provideAppInitializer } from '@angular/core';
import { ThemeService } from './theme.service';

export const provideTheme = () =>
  provideAppInitializer(() => {
    // Note: all we need is for Angular to instantiate the ThemeService as soon as possible to restore the stored theme.
    inject(ThemeService);
  });
