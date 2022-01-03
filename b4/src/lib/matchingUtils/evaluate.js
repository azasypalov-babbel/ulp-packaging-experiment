
import levenshteinDistance from './levenshteinDistance';

const averageDistance = (stringA, stringB, distance) =>
  distance / Math.max(stringA.length, stringB.length);

export const getSubstitutionCost = (characterSubstitutionCosts = []) => (a, b) => {
  if (a === b) return 0;

  const substitution = characterSubstitutionCosts
    .find(({ character, replacement }) => a === character && b === replacement);
  if (substitution) {
    return substitution.cost;
  }

  return 1;
};

export const RESULTS = {
  CORRECT: 'CORRECT',
  INCORRECT: 'INCORRECT',
  TYPO: 'TYPO'
};

const TYPO_THRESHOLD = 0.25;

export const evaluate = ({ attemptText, targetText, substitutionCosts = [] }) => {
  if (attemptText === targetText) {
    return RESULTS.CORRECT;
  }

  const targetTokens = targetText.split(/\s+/);
  const attemptTokens = attemptText.split(/\s+/);
  if (targetTokens.length != attemptTokens.length) {
    return RESULTS.INCORRECT;
  }
  let hasTypo = false;
  for (let i = 0; i < targetTokens.length; i += 1) {
    const distance = levenshteinDistance(
      targetTokens[i],
      attemptTokens[i],
      getSubstitutionCost(substitutionCosts)
    ).distance;
    if (averageDistance(targetTokens[i], attemptTokens[i], distance) > TYPO_THRESHOLD) {
      return RESULTS.INCORRECT;
    } else if (distance > 0) {
      hasTypo = true;
    }
  }
  return hasTypo ? RESULTS.TYPO : RESULTS.CORRECT;
};
