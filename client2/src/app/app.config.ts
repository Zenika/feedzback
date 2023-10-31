import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideBaseHref } from './shared/base-href.provider';
import { provideGraphQL } from './shared/graphql/graphql.providers';
import { provideI18n } from './shared/i18n/i18n.providers';
import { provideSvgIcons } from './shared/icons/icons.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    provideAnimations(),
    provideI18n(),
    provideBaseHref(),
    provideSvgIcons(),
    importProvidersFrom(
      AngularFireModule.initializeApp({
        apiKey: 'AIzaSyDkkgGTo54Osh-rFa3kmpDaDY15xN8Ois0',
        authDomain: 'feedzbackdev-389312.firebaseapp.com',
        projectId: 'feedzbackdev-389312',
        storageBucket: 'feedzbackdev-389312.appspot.com',
        messagingSenderId: '241997452771',
        appId: '1:241997452771:web:f543b1756557362424bcd6',
        measurementId: 'G-7BX0QVS63J',
      }),
      AngularFireAuthModule,
    ),
    provideGraphQL(),
  ],
};
