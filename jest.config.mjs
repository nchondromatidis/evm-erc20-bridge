export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'tests',
  testRegex: '.*\\.t\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testEnvironment: 'node',
};
