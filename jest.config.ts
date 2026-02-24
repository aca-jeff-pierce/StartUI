import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  transform: {
    '^.+\\.(ts|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.html$',
      },
    ],
    '^.+\\.(mjs|js)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@angular|@testing-library|dom-accessibility-api))',
  ],
  moduleFileExtensions: ['ts', 'mjs', 'js', 'html', 'json'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
};

export default config;
