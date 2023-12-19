import { AppEnv } from './config.types';

export const getAppEnvironment = (nodeEnv: string | undefined): AppEnv => {
  const production: AppEnv = 'production';
  return nodeEnv === production ? 'production' : 'developement';
};
