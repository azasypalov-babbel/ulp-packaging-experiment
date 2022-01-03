import { compose } from '../../lib/compose';
import {
  removeCorrectItems,
  makeCorrectItemsNonInteractive,
  makeUnattemptedItemsNonInteractive
} from './trainerFormatters';

const getPurgeFormatter = (trainerType) => ({
  dialog: compose(makeUnattemptedItemsNonInteractive, makeCorrectItemsNonInteractive),
  card: compose(makeUnattemptedItemsNonInteractive, makeCorrectItemsNonInteractive),

  listening: removeCorrectItems,
  dictate: removeCorrectItems,
  matching: removeCorrectItems,
  flashcard: removeCorrectItems,
  vocabulary: removeCorrectItems,

  // trainers not supporting purge
  comprehension: undefined,
  keyboard: undefined,
  spokenreview: undefined
})[trainerType];

const hasMistakes = (trainer) => {
  return trainer.item_groups.some((itemGroup) => {
    return itemGroup.items && itemGroup.items.some((item) => item.attempt && item.attempt.mistakes > 0);
  });
};

const applyPurgeFormatter = (trainer) => {
  const formatter = getPurgeFormatter(trainer.type);

  if (hasMistakes(trainer) && typeof formatter === 'function') {
    return formatter(trainer);
  }

  return null;
};

export default applyPurgeFormatter;
