import barrelServices from '../../../src/services/barrels/default';
import * as FIXTURES from './__fixtures__/default';

describe(`default barrel`, () => {
  test('contains default services', () => {
    expect(barrelServices).toEqual(expect.objectContaining(FIXTURES.services));
  });
});
