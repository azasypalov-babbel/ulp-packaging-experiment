/* eslint-disable no-console */
jest.mock('../../src/lib/features');
import * as features from '../../src/lib/features';
import * as logging from '../../src/lib/logging';


describe(`when feature “is_verbose_logging“ is on`, () => {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(jest.fn());
    features.get.mockImplementation((flag) => flag === 'is_verbose_logging');
  });

  afterAll(() => {
    console.log.mockRestore();
  });

  test('logs to console', () => {
    logging.log('Hello World');
    expect(console.log).toHaveBeenCalledWith('Hello World');
  });
});

describe(`when feature “is_verbose_logging“ is off`, () => {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(jest.fn());
    features.get.mockImplementation(() => false);
  });

  afterAll(() => {
    console.log.mockRestore();
  });

  test('logs to console', () => {
    logging.log('Hello World');
    expect(console.log).not.toHaveBeenCalledWith('Hello World');
  });
});
