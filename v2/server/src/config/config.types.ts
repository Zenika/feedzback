import { ServiceAccount } from 'firebase-admin/app';
import { MailgunClientOptions } from 'mailgun.js';

export type AppEnvironment = 'developement' | 'production';

export type AppConfig = {
  environment: AppEnvironment;

  firebaseServiceAccount: Required<ServiceAccount>;

  mailgunClientOptions: MailgunClientOptions;
};
