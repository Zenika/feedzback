import { FirebaseOptions } from 'firebase/app';
import { APP_VERSION } from '../app/app.version';
import { AppEnv } from './environment.types';

const firebaseOptions: FirebaseOptions = {
  apiKey: 'AIzaSyBJuOG9cIfUN1s1d6uYvB2eo1zKHDFXKZY',
  authDomain: 'feedzback-v2.firebaseapp.com',
  projectId: 'feedzback-v2',
  storageBucket: 'feedzback-v2.appspot.com',
  messagingSenderId: '690479787965',
  appId: '1:690479787965:web:feeb973edf7ec5499e6cd4',
  measurementId: 'G-V2T17HJ69J',
};

export const environment: AppEnv = {
  production: true,
  appVersion: APP_VERSION,
  appDomain: '.znk.io',
  firebaseOptions,
  apiBaseUrl: 'https://server.feedzback.znk.io',
  allowedEmailDomains: ['zenika.com', 'zenika.ch'],
};
