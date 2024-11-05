import { ProcessEnvVars } from './config.schema';
import { AppConfig, AppEnv } from './config.types';

const getAppEnvironment = (nodeEnv: string | undefined): AppEnv => {
  const production: AppEnv = 'production';
  return nodeEnv === production ? 'production' : 'development';
};

const getFirebasePrivateKey = (base64: string) => Buffer.from(base64, 'base64').toString('ascii');

export const mapProcessEnvVarsToAppConfig = (v: ProcessEnvVars): AppConfig => ({
  appEnv: getAppEnvironment(v.NODE_ENV),

  serverPort: v.SERVER_PORT,

  clientUrl: v.CLIENT_URL,

  firebaseServiceAccount: {
    projectId: v.FIREBASE_PROJECT_ID,
    privateKey: getFirebasePrivateKey(v.FIREBASE_PRIVATE_KEY),
    clientEmail: v.FIREBASE_CLIENT_EMAIL,
  },

  firebaseEmulatorMode: v.FIREBASE_AUTH_EMULATOR_HOST || v.FIRESTORE_EMULATOR_HOST,

  mailgunClientOptions: {
    username: v.MAILGUN_USERNAME,
    key: v.MAILGUN_KEY,
    url: v.MAILGUN_URL,
  },

  mailgunDomain: v.MAILGUN_DOMAIN,

  cryptoSecrets: {
    key: v.CRYPTO_SECRET_KEY,
    iv: v.CRYPTO_SECRET_IV,
  },

  featureFlipping: {
    emailValidation: v.FEATURE_FLIPPING_EMAIL_VALIDATION,
  },
});
