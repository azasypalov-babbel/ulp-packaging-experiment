import { evaluate, RESULTS } from '../../../src/lib/matchingUtils/evaluate';

describe('evaluating user input', () => {
  describe('when input has one token', () => {
    describe('should return correct', () => {
      test.each(
        [
          { attemptText: 'A', targetText: 'A', expected: RESULTS.CORRECT, length: 1 },
          { attemptText: 'An', targetText: 'An', expected: RESULTS.CORRECT, length: 2 },
          { attemptText: 'And', targetText: 'And', expected: RESULTS.CORRECT, length: 3 },
          { attemptText: 'Atom', targetText: 'Atom', expected: RESULTS.CORRECT, length: 4 },
          { attemptText: 'Atoms', targetText: 'Atoms', expected: RESULTS.CORRECT, length: 5 },
          { attemptText: 'Always', targetText: 'Always', expected: RESULTS.CORRECT, length: 6 },
          { attemptText: 'Arrange', targetText: 'Arrange', expected: RESULTS.CORRECT, length: 7 },
          { attemptText: 'Arranges', targetText: 'Arranges', expected: RESULTS.CORRECT, length: 8 },
          { attemptText: 'Abbreviate', targetText: 'Abbreviate', expected: RESULTS.CORRECT, length: 10 },
          { attemptText: 'Arrangement', targetText: 'Arrangement', expected: RESULTS.CORRECT, length: 11 }
        ]
      )('when attemptText matches target text with length of $length', ({ attemptText, targetText, expected }) => {
        expect(evaluate({ attemptText, targetText })).toEqual(expected);
      });
    });

    describe('should return typo', () => {
      test.each(
        [

          { attemptText: 'Mann', targetText: 'Man', expected: RESULTS.TYPO, length: 3 },
          { attemptText: 'Eine', targetText: 'Ein', expected: RESULTS.TYPO, length: 3 },
          { attemptText: 'Man', targetText: 'Many', expected: RESULTS.TYPO, length: 4 },
          { attemptText: 'Manyz', targetText: 'Many', expected: RESULTS.TYPO, length: 4 },
          { attemptText: 'Manyy', targetText: 'Many', expected: RESULTS.TYPO, length: 4 },
          { attemptText: 'Manu', targetText: 'Many', expected: RESULTS.TYPO, length: 4 },
          { attemptText: 'Meny', targetText: 'Many', expected: RESULTS.TYPO, length: 4 },
          { attemptText: 'Menu', targetText: 'Menus', expected: RESULTS.TYPO, length: 5 },
          { attemptText: 'Memus', targetText: 'Menus', expected: RESULTS.TYPO, length: 5 },
          { attemptText: 'Menuss', targetText: 'Menus', expected: RESULTS.TYPO, length: 5 },
          { attemptText: 'Maving', targetText: 'Moving', expected: RESULTS.TYPO, length: 6 },
          { attemptText: 'Loving', targetText: 'Moving', expected: RESULTS.TYPO, length: 6 },
          { attemptText: 'Meetin', targetText: 'Meeting', expected: RESULTS.TYPO, length: 7 },
          { attemptText: 'Meetins', targetText: 'Meeting', expected: RESULTS.TYPO, length: 7 },
          { attemptText: 'Meetangs', targetText: 'Meetings', expected: RESULTS.TYPO, length: 8 },
          { attemptText: 'Meetinsg', targetText: 'Meetings', expected: RESULTS.TYPO, length: 8 }
        ]
      )('for one mistake with target text length of $length', ({ attemptText, targetText, expected }) => {
        expect(evaluate({ attemptText, targetText })).toEqual(expected);
      });

      test.each(
        [
          { attemptText: 'Meetin', targetText: 'Meetings', expected: RESULTS.TYPO, length: 8 },
          { attemptText: 'Neetangs', targetText: 'Meetings', expected: RESULTS.TYPO, length: 8 },
          { attemptText: 'Meetansgs', targetText: 'Meetings', expected: RESULTS.TYPO, length: 8 },
          { attemptText: 'Abiltes', targetText: 'Abilities', expected: RESULTS.TYPO, length: 9 },
          { attemptText: 'Abilitiesss', targetText: 'Abilities', expected: RESULTS.TYPO, length: 9 },
          { attemptText: 'Ibilitiec', targetText: 'Abilities', expected: RESULTS.TYPO, length: 9 }
        ]
      )('for two mistakes with target text length of $length', ({ attemptText, targetText, expected }) => {
        expect(evaluate({ attemptText, targetText })).toEqual(expected);
      });

      test.each(
        [
          { attemptText: 'Shrawberyy', targetText: 'Strawberry', expected: RESULTS.TYPO, length: 10 },
          { attemptText: 'Abbreviat', targetText: 'Abbreviation', expected: RESULTS.TYPO, length: 12 },
          { attemptText: 'Abbravietian', targetText: 'Abbreviation', expected: RESULTS.TYPO, length: 12 },
          { attemptText: 'Obbreviatiom', targetText: 'Abbreviation', expected: RESULTS.TYPO, length: 12 }
        ]
      )('for three mistakes with target text length of $length', ({ attemptText, targetText, expected }) => {
        expect(evaluate({ attemptText, targetText })).toEqual(expected);
      });
    });

    describe('should return incorrect', () => {
      test.each(
        [
          { attemptText: 'I', targetText: 'A', expected: RESULTS.INCORRECT, length: 1 },
          { attemptText: 'I', targetText: 'Is', expected: RESULTS.INCORRECT, length: 2 },
          { attemptText: 'Iss', targetText: 'Is', expected: RESULTS.INCORRECT, length: 2 },
          { attemptText: 'It', targetText: 'Is', expected: RESULTS.INCORRECT, length: 2 },
          { attemptText: 'Ist', targetText: 'Is', expected: RESULTS.INCORRECT, length: 2 },
          { attemptText: 'Man', targetText: 'Men', expected: RESULTS.INCORRECT, length: 3 },
          { attemptText: 'Me', targetText: 'Men', expected: RESULTS.INCORRECT, length: 3 },
          { attemptText: 'Ten', targetText: 'Men', expected: RESULTS.INCORRECT, length: 3 }
        ]
      )('for one mistake with target text length of $length', ({ attemptText, targetText, expected }) => {
        expect(evaluate({ attemptText, targetText })).toEqual(expected);
      });

      test.each(
        [
          { attemptText: 'M', targetText: 'Man', expected: RESULTS.INCORRECT, length: 3 },
          { attemptText: 'Meny', targetText: 'Man', expected: RESULTS.INCORRECT, length: 3 },
          { attemptText: 'Manus', targetText: 'Man', expected: RESULTS.INCORRECT, length: 3 },
          { attemptText: 'Ma', targetText: 'Many', expected: RESULTS.INCORRECT, length: 4 },
          { attemptText: 'Nanu', targetText: 'Many', expected: RESULTS.INCORRECT, length: 4 },
          { attemptText: 'Menyy', targetText: 'Many', expected: RESULTS.INCORRECT, length: 4 },
          { attemptText: 'Men', targetText: 'Menus', expected: RESULTS.INCORRECT, length: 5 },
          { attemptText: 'Nemus', targetText: 'Menus', expected: RESULTS.INCORRECT, length: 5 },
          { attemptText: 'Mavimg', targetText: 'Moving', expected: RESULTS.INCORRECT, length: 6 },
          { attemptText: 'Movi', targetText: 'Moving', expected: RESULTS.INCORRECT, length: 6 },
          { attemptText: 'Lovinn', targetText: 'Moving', expected: RESULTS.INCORRECT, length: 6 },
          { attemptText: 'Meeti', targetText: 'Meeting', expected: RESULTS.INCORRECT, length: 7 },
          { attemptText: 'Neetins', targetText: 'Meeting', expected: RESULTS.INCORRECT, length: 7 }
        ]
      )('for two mistakes with target text length of $length', ({ attemptText, targetText, expected }) => {
        expect(evaluate({ attemptText, targetText })).toEqual(expected);
      });

      test.each(
        [
          { attemptText: 'Neetang', targetText: 'Meetings', expected: RESULTS.INCORRECT, length: 8 },
          { attemptText: 'Meeti', targetText: 'Meetings', expected: RESULTS.INCORRECT, length: 8 },
          { attemptText: 'Meatansg', targetText: 'Meetings', expected: RESULTS.INCORRECT, length: 8 },
          { attemptText: 'Abilts', targetText: 'Abilities', expected: RESULTS.INCORRECT, length: 9 },
          { attemptText: 'Abiliteesss', targetText: 'Abilities', expected: RESULTS.INCORRECT, length: 9 },
          { attemptText: 'Ibilatiec', targetText: 'Abilities', expected: RESULTS.INCORRECT, length: 9 },
          { attemptText: 'Strawbe', targetText: 'Strawberry', expected: RESULTS.INCORRECT, length: 10 },
          { attemptText: 'Strewbelly', targetText: 'Strawberry', expected: RESULTS.INCORRECT, length: 10 },
          { attemptText: 'Strewbelrye', targetText: 'Strawberry', expected: RESULTS.INCORRECT, length: 10 }
        ]
      )('for three mistakes with target text length of $length', ({ attemptText, targetText, expected }) => {
        expect(evaluate({ attemptText, targetText })).toEqual(expected);
      });
    });
  });

  describe('when input has multiple tokens', () => {
    it('should return incorrect if one token is incorrect', () => {
      expect(evaluate({ attemptText: 'die Mann', targetText: 'der Mann' }))
        .toEqual(RESULTS.INCORRECT);
    });
    it('should return typo if one token is a typo', () => {
      expect(evaluate({ attemptText: 'diese Mann', targetText: 'dieser Mann' }))
        .toEqual(RESULTS.TYPO);
    });
    it('should return typo if two tokens are typos', () => {
      expect(evaluate({ attemptText: 'dise Mäner', targetText: 'diese Männer' }))
        .toEqual(RESULTS.TYPO);
    });
    it('should return incorrect if input has less tokens than target text', () => {
      expect(evaluate({ attemptText: 'Mann', targetText: 'der Mann' }))
        .toEqual(RESULTS.INCORRECT);
    });
    it('should return incorrect if input has more tokens than target text', () => {
      expect(evaluate({ attemptText: 'der ein Mann', targetText: 'der Mann' }))
        .toEqual(RESULTS.INCORRECT);
    });
    it('should return correct if input matches target text', () => {
      expect(evaluate({ attemptText: 'ein Mann', targetText: 'ein Mann' }))
        .toEqual(RESULTS.CORRECT);
    });
  });
});
