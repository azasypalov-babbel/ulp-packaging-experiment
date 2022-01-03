import barrelServices from '../../../src/services/barrels/cat';
import * as FIXTURES from './__fixtures__/cat';

describe(`cat barrel`, () => {
  test('contains cat services', () => {
    expect(barrelServices).toEqual(expect.objectContaining(FIXTURES.catServices));
  });
});
