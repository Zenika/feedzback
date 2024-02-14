import { FirebaseOptions } from 'firebase/app';
import { APP_VERSION } from '../app/app.version';

const firebaseOptions: FirebaseOptions = {
  apiKey: 'AIzaSyBJuOG9cIfUN1s1d6uYvB2eo1zKHDFXKZY',
  authDomain: 'feedzback-v2.firebaseapp.com',
  projectId: 'feedzback-v2',
  storageBucket: 'feedzback-v2.appspot.com',
  messagingSenderId: '690479787965',
  appId: '1:690479787965:web:feeb973edf7ec5499e6cd4',
  measurementId: 'G-V2T17HJ69J',
};

export const environment = {
  production: true,
  appVersion: APP_VERSION,
  firebaseOptions,
  apiBaseUrl: 'https://server.feedzback.znk.io',
  allowedEmailDomains: ['zenika.com', 'zenika.ch'],
  featureFlipping: {
    autocompleteEmail: true,
    appVersion: true,
    requestTemplate: false,
    localize: false,
    manager: false,
    review: false,
  },
};
