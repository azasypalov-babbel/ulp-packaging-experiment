import { isB2bUser } from '../../../src/dux/profile/selectors';

describe('profile selectors', () => {
  describe('isB2bUser', () => {
    test('returns true if user is a b2bUser', () => {
      const state = { data: { b2bUser: true } };
      expect(isB2bUser(state)).toEqual(true);
    });

    test('returns false if user is not a b2bUser', () => {
      const state = { data: { b2bUser: false } };
      expect(isB2bUser(state)).toEqual(false);
    });

    test('should return false if state has no data', () => {
      const modifiedState = { data: null };
      expect(isB2bUser(modifiedState)).toEqual(false);
    });

    // Selector also used to check API responses and cannot assume the existence of data.
    test('returns false if there is no existing state data', () => {
      expect(isB2bUser(undefined)).toEqual(false);
    });
  });
});
