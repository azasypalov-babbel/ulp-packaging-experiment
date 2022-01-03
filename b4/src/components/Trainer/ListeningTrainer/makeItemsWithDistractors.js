function sortByTextLength(items) {
  return items.sort(function(a, b) {
    const lengthA = a.learnLanguageText.length;
    const lengthB = b.learnLanguageText.length;
    if (lengthA < lengthB) {
      return -1;
    }
    if (lengthA > lengthB) {
      return 1;
    }
    return 0;
  });
}

function chunkItems(items, chunkSize) {
  let results = [];

  let i = 0;
  while (i < items.length) {
    results.push(items.slice(i, i + chunkSize));
    i += chunkSize;
  }

  return results;
}

export function applyGroupingStrategy(items) {
  if (items.length < 6) {
    return [items];
  }

  const sortedItems = sortByTextLength(items);

  let result;
  if (sortedItems.length === 6) {
    result = chunkItems(sortedItems, 3);
  } else if (sortedItems.length < 9) {
    result = chunkItems(sortedItems, 4);
  } else if (sortedItems.length % 5 == 0 || sortedItems.length % 5 > 2) {
    result = chunkItems(sortedItems, 5);
  } else {
    result = chunkItems(sortedItems, 4);
  }


  return result;
}

function removeCurrentItem(items, itemIndex) {
  return items.filter(function(item, index) {
    return index !== itemIndex;
  });
}

function buildDistractors(items) {
  return items.map(function(item, i) {
    return {
      item: item,
      distractors: removeCurrentItem(items, i)
    };
  });
}

function flattenItemsReducer(acc, val) {
  return acc.concat(val);
}

export default function makeItemsWithDistractors(items) {
  const itemsWithDistractors = applyGroupingStrategy(items)
    .map(buildDistractors)
    .reduce(flattenItemsReducer, []);

  return itemsWithDistractors;
}
