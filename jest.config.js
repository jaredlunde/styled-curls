const path = require('path')

module.exports = {
  // testEnvironment: 'jest-environment-jsdom',
  moduleDirectories: [
    'node_modules',
    path.join(__dirname, 'src'),
    path.join(__dirname, 'test'),
  ],
  // moduleNameMapper: {},
  setupFilesAfterEnv: [require.resolve('./test/setup.js')],
  snapshotResolver: require.resolve('./test/resolve-snapshot.js'),
  collectCoverageFrom: [
    'src/{!(Popover),}/{!(propTypes|index|loadImages|browserResets|containmentAttrs|prettyText|portalize),}.{js,jsx}',
  ],
  // coverageThreshold: {
  //   global: {
  //     statements:17,
  //     branches: 4,
  //     lines: 17,
  //     functions: 20
  //   }
  // },
  globals: {
    __DEV__: true,
  },
}
