import { RESULTS } from '../../../lib/matchingUtils/evaluate';

export const matchResult = ({ targetTexts, text }) => {
  return Promise.resolve().then(() => {
    const solved = targetTexts[0] === text;
    const feedbackType = solved
      ? RESULTS.CORRECT
      : RESULTS.INCORRECT;

    return {
      text: targetTexts[0],
      inputText: text,
      feedbackType,
      solved
    };
  });
};
