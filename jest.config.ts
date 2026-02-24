import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
    '^.+\\.(mjs|js)$': 'babel-jest',
    '^.+\\.html$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
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
