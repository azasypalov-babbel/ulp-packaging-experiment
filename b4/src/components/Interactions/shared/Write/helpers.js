import { assesUserInput } from '../../../../lib/matchingUtils/assesUserInput';
import { RESULTS } from '../../../../lib/matchingUtils/evaluate';
import getBestMatch from '../../../../lib/matchingUtils/getBestMatch';

const stripHtml = (s) => s ? s.replace(/(<([^>]+)>)/ig, '') : '';

export const splitBefore = (arr, fn = (char) => char === ' ') =>
  arr.reduce(
    (acc, val, i, arr) => {
      fn(val, i, arr)
        ? acc.push([val])
        : acc[acc.length - 1].push(val);
      return acc;
    }, [[]]
  );

export const insertText = (text) => {
  /**
   * This is a custom function to implement what insertText does natively.
   *
   * document.execCommand('insertText', false, text)
   *
   * The command does not work for Firefox because of a bug.
   * https://bugzilla.mozilla.org/show_bug.cgi?id=1220696
   *
   * When that is fixed we can return to using insertText execCommand.
   */
  const activeElement = document.activeElement;
  if (activeElement.tagName === 'INPUT') {
    const start = activeElement.selectionStart;
    const end = activeElement.selectionEnd;
    const value = activeElement.value;

    activeElement.value = activeElement.value.slice(0, start) +
      text + activeElement.value.slice(end);
    const newEnd = start + text.length;

    activeElement.selectionStart = newEnd;
    activeElement.selectionEnd = newEnd;

    /**
     * Manually fire change event
     * tracker.setValue() is to ensure React recognises the change event.
     *
     * https://github.com/facebook/react/issues/10135#issuecomment-500929024
     */
    // eslint-disable-next-line no-underscore-dangle
    const tracker = activeElement._valueTracker;
    if (tracker) {
      tracker.setValue(value);
    }

    let event;
    if (typeof Event === 'function') {
      event = new Event('change', { bubbles: true });
    } else {
      event = document.createEvent('Event');
      event.initEvent('change', true, true);
    }

    activeElement.dispatchEvent(event);
  }
};

export const getAlternativeSolution = (allTexts, firstSolution) => {
  var alternativeTexts = [];
  if (allTexts.length >= 2) {
    alternativeTexts = allTexts.filter(function(text) {
      if (text !== firstSolution) {
        return text;
      }
    });
  }
  if (alternativeTexts.length === 0) {
    return null;
  }
  return stripHtml(alternativeTexts[0]);
};

export const getClosestMatch = ({ text, targetTexts }) => {
  if (!text) {
    // return the first target text for empty attempt text
    return {
      transformedText: '',
      targetText: targetTexts[0],
      solvedPrefix: ''
    };
  }

  const sanitizedText = text.trim();
  const targetText = getBestMatch(sanitizedText, targetTexts).text;
  const solvedPrefix = sanitizedText.split('').reduce((reduced) => {
    if (targetText.toLowerCase().indexOf(reduced.toLowerCase()) === 0) {
      return reduced;
    }
    return reduced.substring(0, reduced.length - 1);
  }, sanitizedText);

  return {
    transformedText: sanitizedText,
    targetText,
    solvedPrefix
  };
};

export const matchResult = ({ targetTexts, text, learnLanguageAlpha3 }) => {
  const { transformedText, targetText, solvedPrefix } = getClosestMatch({ text, targetTexts });
  return assesUserInput({ attemptText: transformedText, targetText, learnLanguageAlpha3 })
    .then((result) => {
      const solved = result !== RESULTS.INCORRECT;

      const selection = solved ? null :
        {
          start: solvedPrefix.length,
          end: transformedText.length
        };

      return {
        text: targetText,
        inputText: text,
        feedbackType: result,
        solved,
        selection
      };
    });
};

/**
 * omit leading spaces of words
 * @param {Array<{character: string, used: boolean, id: number}>} word
 */
export const trimWordStart = (word) => {
  const firstRealCharacterIdx = word.find(({ character }) => Boolean(character));
  if (firstRealCharacterIdx === -1) {
    return word;
  } else {
    return word.slice(firstRealCharacterIdx);
  }
};
