import { FirebaseOptions } from 'firebase/app';
import { APP_VERSION } from '../app/app.version';
import { AppEnv } from './environment.types';

const firebaseOptions: FirebaseOptions = {
  apiKey: 'AIzaSyBY-HULaNWkEPCoQWCIy3vOB2KB98z4HGs',
  authDomain: 'feedzback-v2-dev.firebaseapp.com',
  projectId: 'feedzback-v2-dev',
  storageBucket: 'feedzback-v2-dev.appspot.com',
  messagingSenderId: '195593920321',
  appId: '1:195593920321:web:e9d6255b8ef9a46466cbc0',
  measurementId: 'G-29CT4FJL84',
};

export const environment: AppEnv = {
  production: false,
  appVersion: APP_VERSION,
  appDomain: '.znk.io',
  firebaseOptions,
  apiBaseUrl: 'https://server.dev.feedzback.znk.io', // `dev-local` and `dev-remote` environments differ only here
  allowedEmailDomains: ['zenika.com', 'zenika.ch'],
  alias: 'dev-remote',
};
