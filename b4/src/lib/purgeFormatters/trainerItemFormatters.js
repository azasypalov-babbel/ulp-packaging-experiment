function removeCorrectItems(items) {
  const incorrectItems = items.filter(function(item) {
    const isItemCorrect = item.attempt && (item.attempt.mistakes === 0);
    return !isItemCorrect;
  });
  return incorrectItems;
}

function makeCorrectItemsNonInteractive(items) {
  return items.map(function(item) {
    const isItemCorrect = item.attempt && (item.attempt.mistakes === 0);

    if (isItemCorrect) {
      return {
        ...item,
        nonInteractive: true
      };
    } else {
      return item;
    }
  });
}

function makeUnattemptedItemsNonInteractive(items) {
  return items.map(function(item) {
    const isItemUnattempted = !item.attempt;

    if (isItemUnattempted) {
      return {
        ...item,
        nonInteractive: true
      };
    } else {
      return item;
    }
  });
}

export default {
  removeCorrectItems,
  makeCorrectItemsNonInteractive,
  makeUnattemptedItemsNonInteractive
};
