import { APP_VERSION } from '../app/app.version';
import { firebaseOptions } from './_environment.dev';
import { AppEnv } from './environment.types';

export const environment: AppEnv = {
  production: false,
  appVersion: APP_VERSION,
  appDomain: '.znk.io',
  firebaseOptions,
  apiBaseUrl: 'https://server.dev.feedzback.znk.io',
  allowedEmailDomains: ['zenika.com', 'zenika.ch'],
  alias: 'dev-remote',
};
