import { AppEnvironment } from './config.types';

export const getAppEnvironment = (node_env: string | undefined): AppEnvironment => {
  const production: AppEnvironment = 'production';
  return node_env === production ? 'production' : 'developement';
};
