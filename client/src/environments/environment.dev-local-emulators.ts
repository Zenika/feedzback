import * as devLocal from './environment.dev-local';
import { AppEnv } from './environment.types';

export const environment: AppEnv = { ...devLocal.environment, firebaseEmulatorMode: true };
