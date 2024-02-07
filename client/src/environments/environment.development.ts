import { FirebaseOptions } from 'firebase/app';

const firebaseOptions: FirebaseOptions = {
  apiKey: 'AIzaSyAZ_4GHJ6mMUBYxMVTYjIENvUla5uIY6C4',
  authDomain: 'feedzback-v2-staging.firebaseapp.com',
  projectId: 'feedzback-v2-staging',
  storageBucket: 'feedzback-v2-staging.appspot.com',
  messagingSenderId: '795807361218',
  appId: '1:795807361218:web:51b2ccfa236de5cff3b35b',
  measurementId: 'G-YVGZP6LZ26',
};

export const environment = {
  production: false,
  firebaseOptions,
  apiBaseUrl: 'http://localhost:3000',
  allowedEmailDomains: ['zenika.com'],
  featureFlipping: {
    manager: true,
    localize: false,
    requestTemplate: true,
    autocompleteEmail: true,
  },
};
