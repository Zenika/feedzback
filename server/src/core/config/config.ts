import { AppConfig } from './config.types';
import { getAppEnvironment } from './config.utils';

export const appConfigLoader = (): AppConfig => ({
  appEnv: getAppEnvironment(process.env.NODE_ENV),

  serverPort: Number(process.env.PORT!),

  clientUrl: process.env.CLIENT_URL!,

  firebaseServiceAccount: {
    projectId: process.env.FIREBASE_PROJECT_ID!,
    privateKey: Buffer.from(process.env.FIREBASE_PRIVATE_KEY!, 'base64').toString('ascii'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
  },

  mailgunClientOptions: {
    username: process.env.MAILGUN_USERNAME!,
    key: process.env.MAILGUN_KEY!,
  },
});
