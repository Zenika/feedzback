import { AppConfig } from './config.types';

export const appConfig = (): AppConfig => ({
  firebaseServiceAccount: {
    projectId: process.env.FIREBASE_PROJECT_ID!,
    privateKey: process.env.FIREBASE_PRIVATE_KEY!,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
  },
});
