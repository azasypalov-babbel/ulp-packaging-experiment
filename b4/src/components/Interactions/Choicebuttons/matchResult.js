import { RESULTS } from '../../../lib/matchingUtils/evaluate';

export const matchResult = ({ targetTexts, text }) => {
  const [correctSentence] = targetTexts.filter((target) =>  text === target);
  const solved = Boolean(correctSentence);
  const feedbackType = solved ? RESULTS.CORRECT : RESULTS.INCORRECT;

  const match = {
    text: solved ? correctSentence : targetTexts[0],
    inputText: text,
    feedbackType,
    solved
  };

  return Promise.resolve(match);
};
