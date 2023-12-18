import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { provideAuth } from './shared/auth/auth.provider';
import { provideBaseHref } from './shared/base-href/base-href.provider';
import { provideConsultant } from './shared/consultant/consultant.provider';
import { provideAllowedEmailDomains } from './shared/form/allowed-email-domains';
import { provideI18n } from './shared/i18n/i18n.providers';
import { provideMatPaginatorIntl } from './shared/i18n/mat-paginator-intl.provider';
import { provideSvgIcons } from './shared/icons/icons.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch()),
    provideAnimations(),
    provideI18n(),
    provideMatPaginatorIntl(),
    provideBaseHref(),
    provideSvgIcons(),
    provideAllowedEmailDomains(environment.allowedEmailDomains),
    provideAuth(),
    provideConsultant(),
  ],
};
