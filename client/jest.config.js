
require('jest-preset-angular')
module.exports = {
  preset: 'jest-preset-angular',
  moduleNameMapper: {

    '@core/(.*)': '<rootDir>/src/app/core/$1',
  },
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testPathIgnorePatterns: ["<rootDir>/cypress/"]
};
