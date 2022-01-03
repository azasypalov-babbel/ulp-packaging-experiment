import { compose } from '../../lib/compose';
import trainerItemFormatters from './trainerItemFormatters';

const withFormattedItems = (itemsFormatter) => (trainer) => {
  if (trainer === null) {
    return null;
  }

  const formatItems = (itemGroups) => {
    return itemGroups.map((group) => {
      return {
        ...group,
        items: itemsFormatter(group.items)
      };
    });
  };

  const removeEmptyItemGroups = (itemGroups) => {
    return itemGroups.filter((group) => {
      return (group.items && group.items.length > 0);
    });
  };

  const formattedTrainer = {
    ...trainer,
    item_groups: compose(removeEmptyItemGroups, formatItems)(trainer.item_groups)
  };

  if (formattedTrainer.item_groups.length > 0) {
    return formattedTrainer;
  }

  return null;
};

export const removeCorrectItems = (trainer) => {
  return withFormattedItems(trainerItemFormatters.removeCorrectItems)(trainer);
};

export const makeCorrectItemsNonInteractive = (trainer) => {
  return withFormattedItems(trainerItemFormatters.makeCorrectItemsNonInteractive)(trainer);
};

export const makeUnattemptedItemsNonInteractive = (trainer) => {
  return withFormattedItems(trainerItemFormatters.makeUnattemptedItemsNonInteractive)(trainer);
};
