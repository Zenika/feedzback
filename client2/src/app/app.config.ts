import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { provideBaseHref } from './shared/base-href.provider';
import { provideGraphQL } from './shared/graphql/graphql.providers';
import { provideI18n } from './shared/i18n/i18n.providers';
import { provideSvgIcons } from './shared/icons/icons.provider';
import { provideMatPaginatorIntl } from './shared/material/paginator-intl.provider';
import { provideAllowedEmailDomains } from './shared/validation/allowed-email-domains/allowed-email-domain.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    provideAnimations(),
    provideI18n(),
    provideBaseHref(),
    provideSvgIcons(),
    provideAllowedEmailDomains(environment.allowedEmailDomains),
    importProvidersFrom(AngularFireModule.initializeApp(environment.firebaseOptions), AngularFireAuthModule),
    provideGraphQL(),
    provideMatPaginatorIntl(),
  ],
};
