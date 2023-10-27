import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideGraphQL } from './shared/graphql/graphql.providers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      AngularFireModule.initializeApp({
        apiKey: 'AIzaSyB1LI5XWQ1JWZ6fKcYoilV9G6_VgE6-KUo',
        authDomain: 'feedz-back.firebaseapp.com',
        projectId: 'feedz-back',
        storageBucket: 'feedz-back.appspot.com',
        messagingSenderId: '83058043747',
        appId: '1:83058043747:web:165d245e30c4002b708156',
        measurementId: 'G-E9BJQJGM8F',
      }),
      AngularFireAuthModule,
    ),
    provideGraphQL(),
  ],
};
