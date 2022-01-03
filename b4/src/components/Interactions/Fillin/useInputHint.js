import { useState, useCallback } from 'react';

export const HINT_LEVEL = {
  NONE: 'NONE',
  TRANSLATION: 'TRANSLATION',
  HINT: 'HINT',
  SOLUTION: 'SOLUTION'
};

const hintSequence = [
  HINT_LEVEL.NONE,
  // HINT_LEVEL.TRANSLATION,
  HINT_LEVEL.HINT,
  HINT_LEVEL.SOLUTION
];

const getNextHintLevel = (hintLevel) =>
  hintSequence[hintSequence.indexOf(hintLevel) + 1] || HINT_LEVEL.NONE;

export const useInputHint = () => {
  const [hintLevel, setHintLevel] = useState(HINT_LEVEL.NONE);
  const [nextHintLevel, setNextHintLevel] = useState(
    getNextHintLevel(HINT_LEVEL.NONE)
  );

  const handleHintClick = useCallback(() => {
    setNextHintLevel((nextHintLevel) => {
      setHintLevel(nextHintLevel);
      return getNextHintLevel(nextHintLevel);
    });
  }, []);

  const resetHint = useCallback(() => {
    setHintLevel(HINT_LEVEL.NONE);
    setNextHintLevel(getNextHintLevel(HINT_LEVEL.NONE));
  }, []);

  return {
    resetHint,
    hintLevel,
    nextHintLevel,
    onHint: handleHintClick
  };
};
