// Jest builder options (https://www.npmjs.com/package/@angular-builders/jest#builder-options)

import type { Config } from 'jest';

export default {
  passWithNoTests: true,
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  //globalSetup: 'jest-preset-angular/global-setup',
} satisfies Config;
