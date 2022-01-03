import { assesUserInput } from '../../../src/lib/matchingUtils/assesUserInput';
import { RESULTS } from '../../../src/lib/matchingUtils/evaluate';
import { fetchSubstitutionCosts } from '../../../src/lib/matchingUtils/fetchSubstitutionCosts';
import { testCases } from './testCasesAll.json';

describe('Assessing user input based on agreed result', () => {
  beforeEach(() => {
    fetchSubstitutionCosts.mockImplementation((learnLanguageAlpha3) => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { characterSubstitutionCosts } = require(
        `../../../src/lib/matchingUtils/substitutionCosts/${learnLanguageAlpha3}.json`
      );
      return Promise.resolve(characterSubstitutionCosts);
    });
  });
  describe('Loose matching mode', () => {
    testCases.forEach(({ attempt, target, learnLanguageAlpha3, looseResult }) => {
      const expectedResults = looseResult === 'solved'
        ? [RESULTS.CORRECT, RESULTS.TYPO]
        : [RESULTS.INCORRECT];

      it(`should result in ${looseResult} when attempting ${target} with ${attempt}`, () => {
        const attemptText = attempt;
        const targetText = target;

        return assesUserInput({ attemptText, targetText, learnLanguageAlpha3 })
          .then((result) => {
            expect(expectedResults).toContain(result);
          });
      });
    });
  });
});

jest.mock('../../../src/lib/matchingUtils/fetchSubstitutionCosts');

describe('assessing user input', () => {
  beforeEach(() => {
    fetchSubstitutionCosts.mockImplementation(() => Promise.resolve([]));
  });
  describe('when no learn language is provided', () => {
    it('not break', () => {
      const attemptText = 'hello';
      const targetText = 'hello';
      const learnLanguageAlpha3 = 'FRA';

      return assesUserInput({ attemptText, targetText, learnLanguageAlpha3 })
        .then((result) => {
          expect(result).toEqual(RESULTS.CORRECT);
        });
    });
  });

  describe('when correct attempt is made', () => {
    it('results is CORRECT', () => {
      const attemptText = 'hello';
      const targetText = 'hello';
      const learnLanguageAlpha3 = 'FRA';

      return assesUserInput({ attemptText, targetText, learnLanguageAlpha3 })
        .then((result) => {
          expect(result).toEqual(RESULTS.CORRECT);
        });
    });
  });

  describe('when incorrect attempt is made', () => {
    it('marks completely wrong as INCORRECT', () => {
      const attemptText = 'olleh';
      const targetText = 'hello';
      const learnLanguageAlpha3 = 'FRA';

      return assesUserInput({ attemptText, targetText, learnLanguageAlpha3 })
        .then((result) => {
          expect(result).toEqual(RESULTS.INCORRECT);
        });
    });

    it('marks one missing letter as TYPO', () => {
      const attemptText = 'helo';
      const targetText = 'hello';
      const learnLanguageAlpha3 = 'FRA';

      return assesUserInput({ attemptText, targetText, learnLanguageAlpha3 })
        .then((result) => {
          expect(result).toEqual(RESULTS.TYPO);
        });
    });
  });

  describe('when an attempt is made with a typo', () => {
    it('results is TYPO', () => {
      fetchSubstitutionCosts.mockImplementation(() => Promise.resolve([
        {
          character: 'è',
          cost: 0.1,
          replacement: 'e'
        }
      ]));
      const attemptText = 'me leve';
      const targetText = 'mè lève';
      const learnLanguageAlpha3 = 'FRA';

      return assesUserInput({ attemptText, targetText, learnLanguageAlpha3 })
        .then((result) => {
          expect(result).toEqual(RESULTS.TYPO);
        });
    });
  });
});
