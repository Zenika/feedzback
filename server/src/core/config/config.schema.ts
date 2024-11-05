import { z } from 'zod';

export const processEnvVarsSchema = z.object({
  NODE_ENV: z.string().optional(),

  SERVER_PORT: z.coerce.number(),

  CLIENT_URL: z.string().url(),

  FIREBASE_PROJECT_ID: z.string(),
  FIREBASE_PRIVATE_KEY: z.string().base64(), // The private key should encoded in base64
  FIREBASE_CLIENT_EMAIL: z.string().email(),

  // For Firebase emulator only, check the presence of these 2 variables
  FIREBASE_AUTH_EMULATOR_HOST: z.coerce.boolean(),
  FIRESTORE_EMULATOR_HOST: z.coerce.boolean(),

  MAILGUN_USERNAME: z.string(),
  MAILGUN_KEY: z.string(),
  MAILGUN_URL: z.string().url(),

  MAILGUN_DOMAIN: z.string(),

  CRYPTO_SECRET_KEY: z.string(),
  CRYPTO_SECRET_IV: z.string(),

  FEATURE_FLIPPING_EMAIL_VALIDATION: z.coerce.boolean(), // This is an optional variable
});

export type ProcessEnvVars = z.infer<typeof processEnvVarsSchema>;
