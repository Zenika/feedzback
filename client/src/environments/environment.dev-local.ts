import { APP_VERSION } from '../app/app.version';
import { firebaseOptions } from './_environment.dev';
import { AppEnv } from './environment.types';

export const environment: AppEnv = {
  production: false,
  appVersion: APP_VERSION,
  appDomain: 'localhost',
  firebaseOptions,
  apiBaseUrl: 'http://localhost:3000',
  allowedEmailDomains: ['zenika.com', 'zenika.ch'],
  alias: 'dev-local',
};
