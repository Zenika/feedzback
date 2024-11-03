import { FirebaseOptions } from 'firebase/app';

export type AppEnv = {
  production: boolean;
  appVersion: string;
  appDomain: string;
  firebaseOptions: FirebaseOptions;
  apiBaseUrl: string;
  allowedEmailDomains: string[];

  // Environment aliases are used to differentiate between different non-production environments.
  // Consequently, there is no alias for the production environement.
  alias?: 'dev-local' | 'dev-remote' | 'staging';

  // Firebase emulators are used for integration and e2e testing
  firebaseEmulatorMode?: true;
};
