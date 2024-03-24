export default {
  testEnvironment: 'node',
  preset: 'ts-jest/presets/default-esm',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
};
