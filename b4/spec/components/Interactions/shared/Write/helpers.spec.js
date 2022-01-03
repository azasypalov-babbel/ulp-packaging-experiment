import * as helpers from '../../../../../src/components/Interactions/shared/Write/helpers';
import { RESULTS } from '../../../../../src/lib/matchingUtils/evaluate';
import { assesUserInput } from '../../../../../src/lib/matchingUtils/assesUserInput';


describe('splitBefore', () => {
  const str1 = 'Babbel';
  const str2 = ' is';
  const str3 = ' great';

  describe('with the default compare function', () => {
    it('should return the correct array of array when 1 word string provided', () => {
      const array = str1.split('');
      expect(helpers.splitBefore(array)).toEqual([array])
    });

    it('should return the correct array of arrays when multi word string provided', () => {
      const str = str1 + str2 + str3;
      const array = str.split('');
      expect(helpers.splitBefore(array)).toEqual([str1.split(''), str2.split(''), str3.split('')])
    });
  });

  describe('with the custom compare function', () => {
    const fn = ({ token }) => token === ' ';
    const strToArr = str => str.split('').map(token => ({ token }))
    it('should return the correct array of array when 1 word string provided', () => {
      const array = strToArr(str1);
      expect(helpers.splitBefore(array, fn)).toEqual([array])
    });

    it('should return the correct array of arrays when multi word string provided', () => {
      const str = str1 + str2 + str3;
      const array = str.split('').map(token => ({ token }));
      expect(helpers.splitBefore(array, fn)).toEqual([strToArr(str1), strToArr(str2), strToArr(str3)])
    });
  });
});

describe('getClosestMatch', () => {
  describe('when multiple correct solutions are available', () => {
    it('should return the one most similar to the attempt text', () => {
      expect(helpers.getClosestMatch({ targetTexts: ['siete', 'siete voi'], text: ' s voi' }).targetText)
        .toEqual('siete voi');
    });
  });
  describe('when text input has leading or trailing spaces', () => {
    it('should return sanitized text without the spaces', () => {
      expect(helpers.getClosestMatch({ targetTexts: ['siete', 'siete voi'], text: ' s voi' }).transformedText)
        .toEqual('s voi');
    });
  });
  describe('when text input starts with same prefix as closest match', () => {
    it('should return the solved prefix of the closest match', () => {
      expect(helpers.getClosestMatch({ targetTexts: ['siete', 'siete voi'], text: ' s voi' }).solvedPrefix)
        .toEqual('s');
    });
  });
  describe('when text input is the first letter of one of the targets', () => {
    it('should return the correct target text', () => {
      expect(helpers.getClosestMatch({ targetTexts: ['estadounidense', 'americano'], text: 'e' }).targetText)
        .toEqual('estadounidense');
    });
  });
});

jest.mock('../../../../../src/lib/matchingUtils/assesUserInput', () => ({
  assesUserInput: jest.fn()
}));

describe('matchResult', () => {
  describe('when it is an error', () => {
    beforeEach(() => {
      assesUserInput.mockReturnValue(Promise.resolve(RESULTS.INCORRECT));
    });
    it('returns', () => {
      expect.assertions(1);
      return expect(helpers.matchResult({
        targetTexts: ['Ich'],
        text: 'So',
        learnLanguageAlpha3: 'DEU'
      })).resolves.toEqual({
        text: 'Ich',
        inputText: 'So',
        feedbackType: RESULTS.INCORRECT,
        solved: false,
        selection: { start: 0, end: 2 }
      });
    });
  });
  describe('when it is a typo', () => {
    beforeEach(() => {
      assesUserInput.mockReturnValue(Promise.resolve(RESULTS.TYPO));
    });
    it('returns', () => {
      expect.assertions(1);
      return expect(helpers.matchResult({
        targetTexts: ['Groß'],
        text: 'Gros',
        learnLanguageAlpha3: 'DEU'
      })).resolves.toEqual({
        text: 'Groß',
        inputText: 'Gros',
        feedbackType: RESULTS.TYPO,
        solved: true,
        selection: null
      });
    });
  });
  describe('when it is correct', () => {
    beforeEach(() => {
      assesUserInput.mockReturnValue(Promise.resolve(RESULTS.CORRECT));
    });
    it('returns', () => {
      expect.assertions(1);
      return expect(helpers.matchResult({
        targetTexts: ['Hallo'],
        text: 'Hallo',
        learnLanguageAlpha3: 'DEU'
      })).resolves.toEqual({
        text: 'Hallo',
        inputText: 'Hallo',
        feedbackType: RESULTS.CORRECT,
        solved: true,
        selection: null
      });
    });
  });
});

describe('#getAlternativeSolution', () => {
  it('returns null if there are no alternative solutions', () => {
    expect(helpers.getAlternativeSolution(['bar'], 'bar')).toEqual(null);
  });

  it('returns the first of many alternative solutions', () => {
    expect(helpers.getAlternativeSolution(['foo', 'bar', 'faz', 'manyyz'], 'bar')).toEqual('foo');
  });

  it('returns the first if there is exactly one alternative solutions', () => {
    expect(helpers.getAlternativeSolution(['bar', 'faz'], 'bar')).toEqual('faz');
  });

  it('strips html tags from the returned alternative solution', () => {
    expect(helpers.getAlternativeSolution(['this is <i>italic</i> and <b>bold</b>', 'bar'], 'bar'))
      .toEqual('this is italic and bold');
  });
});
