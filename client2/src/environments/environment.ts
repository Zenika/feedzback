import { FirebaseOptions } from '@angular/fire/app';
import { Options as ApolloOptions } from 'apollo-angular/http';

const firebaseOptions: FirebaseOptions = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
  measurementId: '',
};

const apolloOptions: ApolloOptions = {
  uri: '',
};

export const environment = {
  production: true,
  firebaseOptions,
  apolloOptions,
  allowedEmailDomains: ['zenika.com'],
  signInAsGuest: false,
};
