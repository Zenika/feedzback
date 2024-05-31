import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { provideAuth } from './shared/auth';
import { provideBaseHref } from './shared/base-href/base-href.provider';
import { provideLanguage } from './shared/i18n/language';
import { provideMatPaginatorIntl } from './shared/i18n/mat-paginator-intl.provider';
import { provideSvgIcons } from './shared/icons/icons.provider';
import { loadingInterceptor } from './shared/loading/loading.interceptor';
import { provideTheme } from './shared/theme/theme.provider';
import { provideAllowedEmailDomains } from './shared/validation/allowed-email-domains';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideHttpClient(withFetch(), withInterceptors([loadingInterceptor])),
    provideAnimations(),
    provideMatPaginatorIntl(),
    provideBaseHref(),
    provideSvgIcons(),
    provideAuth(),
    provideLanguage(),
    provideTheme(),
    provideAllowedEmailDomains(environment.allowedEmailDomains),
  ],
};
