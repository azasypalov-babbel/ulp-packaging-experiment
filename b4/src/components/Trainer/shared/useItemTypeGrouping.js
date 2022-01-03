import { useCallback, useMemo } from 'react';

const last = (arr) => (arr && arr.length ? arr[arr.length - 1] : undefined);

const chunkByDifference = (elements) => elements.reduce((groups, current, currentIndex, array) => {
  const previous = array[currentIndex - 1];
  const didChange = current !== previous && array[0] === current;
  if (didChange) {
    groups.push([]);
  }
  last(groups).push(currentIndex);
  return groups;
}, []);

export const createGroupMapping = (items) =>
  chunkByDifference(items.map((item) => item.type));

export const getLastIndexInGroup = (currentItem, items, groups) => {
  const startIndex = items.findIndex((item) => item === currentItem);

  return last(groups.find((group) => group.includes(startIndex)));
};

export const getIndexInGroup = (currentItem, items, groups) => {
  const startIndex = items.findIndex((item) => currentItem === item);

  return groups.find((group) => group.includes(startIndex)).indexOf(startIndex);
};

export const useItemTypeGrouping = (currentItem, items) => {
  const groups = useMemo(() => createGroupMapping(items), [items]);

  const lastIndexInGroup = useMemo(() =>
    getLastIndexInGroup(currentItem, items, groups)
  , [groups, currentItem, items]);

  const getIndexInGroupCallback = useCallback((item) =>
    getIndexInGroup(item, items, groups)
  , [items, groups]);

  return [lastIndexInGroup, getIndexInGroupCallback];
};
