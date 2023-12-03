import { FirebaseOptions } from '@angular/fire/app';

const firebaseOptions: FirebaseOptions = {
  apiKey: 'AIzaSyBY-HULaNWkEPCoQWCIy3vOB2KB98z4HGs',
  authDomain: 'feedzback-v2-dev.firebaseapp.com',
  projectId: 'feedzback-v2-dev',
  storageBucket: 'feedzback-v2-dev.appspot.com',
  messagingSenderId: '195593920321',
  appId: '1:195593920321:web:e9d6255b8ef9a46466cbc0',
  measurementId: 'G-29CT4FJL84',
};

export const environment = {
  production: false,
  firebaseOptions,
  apiBaseUrl: 'http://localhost:3000',
  allowedEmailDomains: ['zenika.com'],
  signInAsGuest: false,
};
