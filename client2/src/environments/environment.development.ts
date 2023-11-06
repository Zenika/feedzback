import { FirebaseOptions } from '@angular/fire/app';
import { Options as ApolloOptions } from 'apollo-angular/http';

const firebaseOptions: FirebaseOptions = {
  apiKey: 'AIzaSyDkkgGTo54Osh-rFa3kmpDaDY15xN8Ois0',
  authDomain: 'feedzbackdev-389312.firebaseapp.com',
  projectId: 'feedzbackdev-389312',
  storageBucket: 'feedzbackdev-389312.appspot.com',
  messagingSenderId: '241997452771',
  appId: '1:241997452771:web:f543b1756557362424bcd6',
  measurementId: 'G-7BX0QVS63J',
};

const apolloOptions: ApolloOptions = {
  uri: 'http://localhost:4000/graphql',
};

const allowedEmailDomains = ['zenika.com'];

export const environment = {
  production: false,
  firebaseOptions,
  apolloOptions,
  allowedEmailDomains,
};
