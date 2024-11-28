import { inject, provideAppInitializer } from '@angular/core';
import { LanguageService } from './language.service';

export const provideLanguage = () => provideAppInitializer(() => inject(LanguageService).init());
