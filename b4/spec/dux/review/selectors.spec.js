import {
  remainingItemCount
} from '../../../src/dux/review/selectors';

describe('Review selectors', () => {
  describe('remainingItemCount', () => {
    test('returns amount of remaining items count', () => {
      const state = {
        reviewItems: {
          remainingItemCount: 2
        }
      };

      expect(remainingItemCount(state)).toBe(2);
    });
  });
});
