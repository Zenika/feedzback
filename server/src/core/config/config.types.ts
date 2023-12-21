import { ServiceAccount } from 'firebase-admin/app';
import { MailgunClientOptions } from 'mailgun.js';

export type AppEnv = 'developement' | 'production';

export type AppConfig = {
  appEnv: AppEnv;

  serverPort: number;

  clientUrl: string;

  firebaseServiceAccount: Required<ServiceAccount>;

  mailgunClientOptions: MailgunClientOptions;
};
