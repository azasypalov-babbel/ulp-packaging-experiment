import {
  totalVocabularyCount,
  userHasCompletedLessons
} from '../../../src/dux/statistics/selectors';

describe('statistics selectors', () => {
  const state = {
    data: {
      totalVocabularyCount: 42
    }
  };

  describe('#totalVocabularyCount', () => {
    test('should select totalVocabularyCount', () => {
      expect(totalVocabularyCount(state)).toEqual(42);
    });

    describe('when data is not available', () => {
      const state = {
        data: null
      };

      test('should return null', () => {
        expect(totalVocabularyCount(state)).toEqual(null);
      });
    });
  });

  describe('#userHasCompletedLessons', () => {
    test('should return true if user has learned vocabulary', () => {
      expect(userHasCompletedLessons(state)).toEqual(true);
    });

    test('should return false if user has no learned vocabulary', () => {
      const modifiedState = { data: { totalVocabularyCount: 0 } };
      expect(userHasCompletedLessons(modifiedState)).toEqual(false);
    });

    test('should return false if state has no data', () => {
      const modifiedState = { data: null };
      expect(userHasCompletedLessons(modifiedState)).toEqual(false);
    });

    // Selector also used to check API responses and cannot assume the existence of data.
    test('should return false if state does not exist', () => {
      expect(userHasCompletedLessons(undefined)).toEqual(false);
    });
  });
});
