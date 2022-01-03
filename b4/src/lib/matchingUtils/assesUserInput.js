import { normalise } from './normalise';
import { evaluate } from './evaluate';
import { fetchSubstitutionCosts } from './fetchSubstitutionCosts';

export const assesUserInput = ({ attemptText, targetText, learnLanguageAlpha3 }) => {
  const normalisedAttemptText = normalise(attemptText, learnLanguageAlpha3);
  const normalisedTargetText = normalise(targetText, learnLanguageAlpha3);

  return fetchSubstitutionCosts(learnLanguageAlpha3)
    .then((substitutionCosts) =>
      evaluate({
        attemptText: normalisedAttemptText,
        targetText: normalisedTargetText,
        substitutionCosts
      })
    );
};
