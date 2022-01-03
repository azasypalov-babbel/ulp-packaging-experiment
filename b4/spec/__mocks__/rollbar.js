const rollbarInstance = {
  init: () => rollbarInstance,
  error: jest.fn(),
  info: jest.fn(),
  warning: jest.fn(),
  debug: jest.fn()
};

module.exports = rollbarInstance;
