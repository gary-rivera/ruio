import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  rootDir: '..',
  testMatch: ['<rootDir>/test/**/*.test.{ts,tsx}'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/test/tsconfig.json',
      },
    ],
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  modulePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
  moduleNameMapper: {
    // SVG and CSS mocks must come first (more specific patterns)
    '\\.svg\\?react$': '<rootDir>/test/__mocks__/svgMock.tsx',
    '\\.svg$': '<rootDir>/test/__mocks__/svgMock.tsx',
    '\\.module\\.css$': '<rootDir>/test/__mocks__/styleMock.ts',
    '\\.css$': '<rootDir>/test/__mocks__/styleMock.ts',
    // Path aliases come after (more general patterns)
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@context/(.*)$': '<rootDir>/src/context/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@constants/(.*)$': '<rootDir>/src/constants/$1',
    '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^@root/(.*)$': '<rootDir>/src/$1',
    '^@assets/(.*)$': '<rootDir>/src/assets/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts'],
}

export default config
