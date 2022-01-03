import indexCommon from '../../../src/services/barrels/common';
import * as FIXTURES from './__fixtures__/common';

describe(`common barrel`, () => {
  test('contains common services', () => {
    expect(indexCommon).toEqual(FIXTURES.commonServices);
  });
});
