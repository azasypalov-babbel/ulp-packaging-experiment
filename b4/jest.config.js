// jest.config.js
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  clearMocks: true,
  verbose: true,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    '<rootDir>/.jest/setupJest.js',
    '<rootDir>/.jest/globals.js'
  ],
  snapshotSerializers: [
    'enzyme-to-json/serializer'
  ],
  collectCoverageFrom: [
    'src/**/*.(js|tsx?)',
    '!src/demo/(mocks|data)/**'
  ],
  moduleNameMapper: {
    '\\.(svg|scss|css|png|gif|jpg|jpeg|less|woff|woff2)$': '<rootDir>/.jest/fileMock.js',
    "^@assets(.*)$": "<rootDir>/assets$1",
    "^@spec(.*)$": "<rootDir>/spec$1",
    "^@src(.*)$": "<rootDir>/src$1",
    "^@stories(.*)$": "<rootDir>/stories$1",
    "^@vendor(.*)$": "<rootDir>/vendor$1"
  },
  transform: {
    '\\.(js|tsx?)$': 'babel-jest',
    '\\.(mp3)$': '<rootDir>/.jest/fileTransformer.js'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!@lessonnine/react-ui-components.js).+\\.js$'
  ],
  moduleFileExtensions: [
    'js',
    'ts',
    'tsx',
    'json'
  ]
};
