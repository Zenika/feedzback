import { FirebaseOptions } from 'firebase/app';

const firebaseOptions: FirebaseOptions = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
  measurementId: '',
};

export const environment = {
  production: true,
  firebaseOptions,
  apiBaseUrl: '',
  allowedEmailDomains: ['zenika.com'],
  signInAsGuest: false,
};
