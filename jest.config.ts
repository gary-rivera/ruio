import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // Ensures that the DOM environment is simulated
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', // Use ts-jest for TypeScript files
    '^.+\\.(js|jsx)$': 'babel-jest', // Use babel-jest for JavaScript files
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  modulePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'], // Ignore compiled files and node_modules
  moduleNameMapper: {
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@context/(.*)$': '<rootDir>/src/context/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Jest setup file
}

export default config