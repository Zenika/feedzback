import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { provideAuth } from './shared/auth';
import { provideBaseHref } from './shared/base-href';
import { provideLanguage } from './shared/i18n/language';
import { provideMatPaginatorIntl } from './shared/i18n/mat-paginator-intl.provider';
import { provideSvgIcons } from './shared/icon';
import { loadingInterceptor } from './shared/loading';
import { provideTheme } from './shared/theme';
import { provideAllowedEmailDomains } from './shared/validation/allowed-email-domains';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideHttpClient(withFetch(), withInterceptors([loadingInterceptor])),
    provideAnimationsAsync(),
    provideMatPaginatorIntl(),
    provideBaseHref(),
    provideSvgIcons(),
    provideAuth(),
    provideLanguage(),
    provideTheme(),
    provideAllowedEmailDomains(environment.allowedEmailDomains),
  ],
};
