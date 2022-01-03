import * as catServices from '../../src/services/catReviewService';
import * as reviewServices from '../../src/services/reviewService';

describe('CAT Review Service', () => {
  describe('#moduleExports', () => {
    test('it exports the same methods as the "regular" review service', () => {
      expect(Object.keys(catServices.default)).toEqual(Object.keys(reviewServices.default));
    });
  });
});

