import {
  formatParentheses,
  getFirstCorrectSolution,
  removeGapFormatting,
  removeFirstParanthesesAndGapsFormatting,
  markupStringToPlainText
} from '@lessonnine/babbel-markup-helper.js';

import {
  formatDL,
  formatLL,
  stripParantheses
} from '../../src/lib/markupFormatter';

jest.mock('@lessonnine/babbel-markup-helper.js', () => ({
  getFirstCorrectSolution: jest.fn((a) => a),
  formatParentheses: jest.fn((a) => a),
  removeGapFormatting: jest.fn((a) => a),
  markupStringToPlainText: jest.fn((a) => a),
  removeFirstParanthesesAndGapsFormatting: jest.fn((a) => a)
}));

describe('markupFormatter', () => {
  beforeEach(() => {
    getFirstCorrectSolution.mockClear();
    formatParentheses.mockClear();
    removeGapFormatting.mockClear();
    markupStringToPlainText.mockClear();
    removeFirstParanthesesAndGapsFormatting.mockClear();
  });

  describe('formatDL (display language)', () => {
    test('calls required formatters', () => {
      formatDL('test-string');

      expect(removeGapFormatting).toHaveBeenCalled();
      expect(formatParentheses).toHaveBeenCalled();
      expect(markupStringToPlainText).toHaveBeenCalled();
      expect(removeFirstParanthesesAndGapsFormatting).toHaveBeenCalled();
    });

    test('returns empty string when empty string is given', () => {
      expect(formatDL('')).toBe('');
    });
  });

  describe('formatLL (learning language)', () => {
    test('calls required formatters', () => {
      formatLL('test-string');

      expect(removeGapFormatting).toHaveBeenCalled();
      expect(formatParentheses).toHaveBeenCalled();
      expect(markupStringToPlainText).toHaveBeenCalled();
      expect(getFirstCorrectSolution).toHaveBeenCalled();
    });

    test('returns empty string when empty string is given', () => {
      expect(formatLL('')).toBe('');
    });
  });

  describe('stripParantheses', () => {
    test('strips parentheses and content', () => {
      const sentence = stripParantheses('text (more)');
      expect(sentence).toBe('text');
    });
  });
});
