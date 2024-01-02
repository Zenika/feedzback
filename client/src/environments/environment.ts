import { FirebaseOptions } from 'firebase/app';

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
  firebaseOptions,
  apiBaseUrl: 'https://server.feedzback.znk.io',
  allowedEmailDomains: ['zenika.com'],
  featureFlipping: {
    manager: false,
  },
};
