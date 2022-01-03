import indexMock from '../../../src/services/barrels/mock';
import * as FIXTURES from './__fixtures__/mock';

describe(`mocked barrel`, () => {
  test('contains mocked services', () => {
    expect(indexMock).toEqual(FIXTURES.mockedServices);
  });
});
