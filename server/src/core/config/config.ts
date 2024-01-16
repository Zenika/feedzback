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

  oauth2Client: {
    clientId: process.env.CLIENT_ID!,
    clientSecret: process.env.CLIENT_SECRET!,
    redirectUri: process.env.OAUTH_REDIRECT_URL!,
  },

  mailgunClientOptions: {
    username: process.env.MAILGUN_USERNAME!,
    key: process.env.MAILGUN_KEY!,
    url: process.env.MAILGUN_URL!,
  },

  mailgunDomain: process.env.MAILGUN_DOMAIN!,

  cryptoSecrets: {
    key: process.env.CRYPTO_SECRET_KEY!,
    iv: process.env.CRYPTO_SECRET_IV!,
  },
});
