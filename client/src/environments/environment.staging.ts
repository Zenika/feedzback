import { FirebaseOptions } from 'firebase/app';
import { APP_VERSION } from '../app/app.version';
import { AppEnv } from './environment.types';

const firebaseOptions: FirebaseOptions = {
  apiKey: 'AIzaSyAZ_4GHJ6mMUBYxMVTYjIENvUla5uIY6C4',
  authDomain: 'feedzback-v2-staging.firebaseapp.com',
  projectId: 'feedzback-v2-staging',
  storageBucket: 'feedzback-v2-staging.appspot.com',
  messagingSenderId: '795807361218',
  appId: '1:795807361218:web:51b2ccfa236de5cff3b35b',
  measurementId: 'G-YVGZP6LZ26',
};

export const environment: AppEnv = {
  production: false,
  appVersion: APP_VERSION,
  appDomain: '.znk.io',
  firebaseOptions,
  apiBaseUrl: 'https://server.staging.feedzback.znk.io',
  allowedEmailDomains: ['zenika.com', 'zenika.ch'],
  alias: 'staging',
};
