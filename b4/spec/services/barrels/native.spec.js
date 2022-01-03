import barrelServices from '../../../src/services/barrels/native';
import * as FIXTURES from './__fixtures__/native';

describe(`native barrel`, () => {
  test('contains native services', () => {
    expect(barrelServices).toEqual(expect.objectContaining(FIXTURES.nativeServices));
  });
});
