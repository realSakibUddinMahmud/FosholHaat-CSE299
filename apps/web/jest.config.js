/* eslint-disable @typescript-eslint/no-require-imports */
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@fosholhaat/types/(.*)$': '<rootDir>/../../packages/types/src/$1',
    '^@fosholhaat/tokens/(.*)$': '<rootDir>/../../packages/tokens/$1',
    '^react-dom/test-utils$': '<rootDir>/test/react-dom-test-utils.js'
  }
}

module.exports = createJestConfig(customJestConfig)
