import { FirebaseOptions } from 'firebase/app';

// TODO: provide values for the "staging" environement
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
  production: false,
  firebaseOptions,
  apiBaseUrl: '', // TODO: provide value for the "staging" environement
  allowedEmailDomains: ['zenika.com'],
  featureFlipping: {
    manager: false,
  },
};
