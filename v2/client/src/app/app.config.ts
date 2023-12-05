import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { provideBaseHref } from './shared/base-href.provider';
import { provideI18n } from './shared/i18n/i18n.providers';
import { provideSvgIcons } from './shared/icons/icons.provider';
import { provideMatPaginatorIntl } from './shared/ui/material/paginator-intl.provider';
import { provideAllowedEmailDomains } from './shared/validation/allowed-email-domains/allowed-email-domain.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch()),
    provideAnimations(),
    provideI18n(),
    provideBaseHref(),
    provideSvgIcons(),
    provideAllowedEmailDomains(environment.allowedEmailDomains),
    provideMatPaginatorIntl(),
  ],
};
