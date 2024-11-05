import { Logger } from '@nestjs/common';
import { ZodError } from 'zod';
import { processEnvVarsSchema } from './config.schema';
import { AppConfig } from './config.types';
import { mapProcessEnvVarsToAppConfig } from './config.utils';

export const appConfigLoader = (): AppConfig => {
  const logger = new Logger('AppConfig');

  try {
    const processEnvVars = processEnvVarsSchema.parse(process.env);

    logger.log('Validation succeeded');

    return mapProcessEnvVarsToAppConfig(processEnvVars);
  } catch (zodError) {
    logger.fatal(`Validation failed ${(zodError as ZodError).message}`);

    throw new Error('[AppConfig] Validation failed');
  }
};
