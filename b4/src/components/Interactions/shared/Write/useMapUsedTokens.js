import { useState, useEffect } from 'react';
import { mapUsedTokens } from '../../../../lib/matchingUtils/mapUsedTokens';
import { fetchSubstitutionCosts } from '../../../../lib/matchingUtils/fetchSubstitutionCosts';

export const useMapUsedTokens = (learnLanguageAlpha3) => {
  const [substitutionCosts, setSubstitutionCosts] = useState();
  useEffect(() => {
    let aborted = false;
    fetchSubstitutionCosts(learnLanguageAlpha3)
      .then((substitutionCosts) => {
        if (!aborted) {
          setSubstitutionCosts(substitutionCosts);
        }
      });
    return () => {
      aborted = true;
    };
  }, [learnLanguageAlpha3]);

  return (options) => mapUsedTokens({
    ...options,
    substitutionCosts
  });
};
