import { useMemo } from 'react';
import { last } from 'underscore';

export const useMatchLogic = (itemPairs, attempts) => {
  const bases = useMemo(() =>
    itemPairs.map((itemPair) => {
      const attempt = last(attempts.get(itemPair.id));
      return {
        id: itemPair.id,
        itemId: itemPair.id,
        markup: itemPair.baseMarkup,
        isMatched: attempt?.isSolved === true,
        soundId: itemPair.soundId
      };
    }),
  [attempts, itemPairs]);

  const [matchedOptions, unmatchedOptions] = useMemo(() => {
    // Matched options should be presented in the order they were selected
    const matchedOptionIndexes = itemPairs.flatMap((itemPair) => {
      const attempt = last(attempts.get(itemPair.id));
      if (!attempt?.isSolved) return [];
      return [attempt.selectedOption];
    });

    const unmatchedOptionIndexes = itemPairs
      .flatMap((_, index) => matchedOptionIndexes.includes(index)
        ? []
        : [index]
      );

    const toOption = ({ isMatched }) => (optionIndex, baseIndex) => {
      const itemPair = itemPairs[optionIndex];
      const baseItemPair = itemPairs[baseIndex];
      return {
        id: optionIndex,
        correspondingBaseId: itemPair.id,
        markup: itemPair.optionMarkup,
        translation: isMatched ? baseItemPair.translation : itemPair.translation,
        isMatched,
        soundId: isMatched ? baseItemPair.soundId : itemPair.soundId
      };
    };

    const matchedOptions = matchedOptionIndexes.map(toOption({ isMatched: true }));
    const unmatchedOptions = unmatchedOptionIndexes.map(toOption({ isMatched: false }));

    return [matchedOptions, unmatchedOptions];
  }, [attempts, itemPairs]);

  return [bases, matchedOptions, unmatchedOptions];
};
