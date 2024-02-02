// Jest builder options (https://www.npmjs.com/package/@angular-builders/jest#builder-options)

import type { Config } from 'jest';

export default {
  passWithNoTests: true,
  setupFiles: ['./setup-jest.ts'],
} satisfies Config;
