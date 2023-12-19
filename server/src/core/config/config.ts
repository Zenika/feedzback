import { AppConfig } from './config.types';
import { getAppEnvironment } from './config.utils';

export const appConfigLoader = (): AppConfig => ({
  appEnv: getAppEnvironment(process.env.NODE_ENV),

  clientUrl: process.env.CLIENT_URL!,

  firebaseServiceAccount: {
    projectId: process.env.FIREBASE_PROJECT_ID!,
    privateKey: process.env.FIREBASE_PRIVATE_KEY!,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
  },

  mailgunClientOptions: {
    username: process.env.MAILGUN_USERNAME!,
    key: process.env.MAILGUN_KEY!,
  },
});
