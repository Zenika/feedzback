import { ServiceAccount } from 'firebase-admin/app';
import { MailgunClientOptions } from 'mailgun.js';

export type AppEnv = 'development' | 'production';

export type AppConfig = {
  appEnv: AppEnv;

  serverPort: number;

  clientUrl: string;

  firebaseServiceAccount: Required<ServiceAccount>;

  firebaseEmulatorMode: boolean;

  mailgunClientOptions: Required<Pick<MailgunClientOptions, 'username' | 'key' | 'url'>>;

  mailgunDomain: string;

  cryptoSecrets: {
    key: string;
    iv: string;
  };

  featureFlipping: {
    emailValidation: boolean;
  };
};
