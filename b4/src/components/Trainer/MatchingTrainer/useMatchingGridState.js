import PropTypes from 'prop-types';
import { shuffle } from 'underscore';
import { useMemo } from 'react';
import { flatten, zip } from 'underscore';
import { ITEM_FRAGMENT_TYPE } from './constants';

export const useMatchingGridState = (
  bases,
  matchedOptions,
  unmatchedOptions,
  currentItem,
  latestAttempt
) => {
  // Calculate option order once so that options don't get shuffled each update
  const shuffledOrder = useMemo(
    () => shuffle(new Array(bases.length)
      .fill()
      .map((_, index) => index)),
    [bases.length]
  );

  // Map in latest attempt state to the bases
  const statefulBaseList = useMemo(() => bases
    .map((base) => {
      const isActive = currentItem.id === base.itemId;
      return {
        id: base.id,
        text: base.markup,
        type: ITEM_FRAGMENT_TYPE.BASE,
        isActive,
        isMatched: base.isMatched,
        isHidden: !(isActive || base.isMatched),
        soundId: base.soundId
      };
    }),
  [bases, currentItem]);

  // Construct the final options list
  const statefulOptionList = useMemo(() => {
    const shuffledUnmatchedOptions = unmatchedOptions
      // Re-arrange unmatched options into the order they appear in the shuffled order list
      .reduce((acc, option) => {
        acc[shuffledOrder.indexOf(option.id)] = option;
        return acc;
      }, [])
      .filter(Boolean); // Remove empty array positions

    return matchedOptions // Present matched options in their selected order
      .concat(shuffledUnmatchedOptions) // Then arrange the remaining, unmatched items in shuffled order
      // Map in latest attempt state to the options
      .map((option) => {
        const solvedBy = latestAttempt?.selectedOption === option.id;
        const isSuccess = solvedBy && latestAttempt?.isSolved === true;
        const isError = solvedBy && latestAttempt?.isSolved === false;

        return {
          id: option.id,
          correspondingBaseId: option.correspondingBaseId,
          text: option.markup,
          type: ITEM_FRAGMENT_TYPE.OPTION,
          translation: option.translation,
          isMatched: option.isMatched,
          isActive: isSuccess,
          isSuccess,
          isError,
          soundId: option.soundId
        };
      });
  },
  [latestAttempt, shuffledOrder, matchedOptions, unmatchedOptions]);

  const grid = useMemo(
    () => flatten(zip(statefulBaseList, statefulOptionList)),
    [statefulBaseList, statefulOptionList]
  );

  return grid;
};

export const matchGridPropType = PropTypes.arrayOf(
  PropTypes.oneOfType([
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.any.isRequired,
      isActive: PropTypes.bool.isRequired,
      isHidden: PropTypes.bool.isRequired,
      isMatched: PropTypes.bool.isRequired,
      soundId: PropTypes.string,
      type: PropTypes.oneOf([ITEM_FRAGMENT_TYPE.BASE]).isRequired
    }),
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      correspondingBaseId: PropTypes.string.isRequired,
      text: PropTypes.any.isRequired,
      translation: PropTypes.any,
      isSuccess: PropTypes.bool,
      isMatched: PropTypes.bool.isRequired,
      isError: PropTypes.bool,
      soundId: PropTypes.string,
      type: PropTypes.oneOf([ITEM_FRAGMENT_TYPE.OPTION]).isRequired
    })
  ])
);
