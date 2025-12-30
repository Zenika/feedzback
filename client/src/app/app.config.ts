import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { provideAuth } from './shared/auth';
import { authInterceptor } from './shared/auth/auth.interceptor';
import { provideBaseHref } from './shared/base-href';
import { provideFirebaseEmulator } from './shared/firebase';
import { provideLanguage } from './shared/i18n/language';
import { provideMatPaginatorIntl } from './shared/i18n/mat-paginator-intl.provider';
import { provideSvgIcons } from './shared/icon';
import { loadingInterceptor } from './shared/loading';
import { provideSession } from './shared/session';
import { provideTheme } from './shared/theme';
import { provideAllowedEmailDomains } from './shared/validation/allowed-email-domains';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
    ),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, loadingInterceptor])),
    provideMatPaginatorIntl(),
    provideBaseHref(),
    provideSvgIcons(),
    provideAuth(),
    provideSession(),
    provideLanguage(),
    provideTheme(),
    provideAllowedEmailDomains(environment.allowedEmailDomains),

    environment.firebaseEmulatorMode ? provideFirebaseEmulator() : [],
  ],
};
