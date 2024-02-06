import { AppConfig } from './config.types';
import { getAppEnvironment } from './config.utils';

export const appConfigLoader = (): AppConfig => {
  const firebaseServiceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID!,
    privateKey: Buffer.from(process.env.FIREBASE_PRIVATE_KEY!, 'base64').toString('ascii'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
  };

  return {
    appEnv: getAppEnvironment(process.env.NODE_ENV),

    serverPort: Number(process.env.PORT!),

    clientUrl: process.env.CLIENT_URL!,

    firebaseServiceAccount,

    googleApis: {
      serviceAccount: firebaseServiceAccount.clientEmail,
      privateKey: firebaseServiceAccount.privateKey,
      scopes: ['https://www.googleapis.com/auth/admin.directory.user.readonly'],
    },
    cache: {
      userListExpiryHour: Number(process.env.CACHE_USER_LIST_EXPIRY_HOUR),
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

    featureFlipping: {
      emailValidation: process.env.FEATURE_FLIPPING_EMAIL_VALIDATION === 'true',
    },
  };
};
