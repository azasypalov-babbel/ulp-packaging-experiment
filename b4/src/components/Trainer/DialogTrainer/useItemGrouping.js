import { useCallback, useMemo } from 'react';

export const createSpeakerGrouping = (items) => items.reduce((prev, curr, index) => {
  if (index == 0) {
    return [[{ i: index, item: curr }]];
  } else if (curr?.speakerRole == prev[prev.length - 1][0].item?.speakerRole) {
    const items = [...prev];
    items[items.length - 1].push({ i: index, item: curr });
    return items;
  } else {
    return [...prev, [{ i: index, item: curr }]];
  }
}, []);

export const isFirst = (grouping, item) =>
  grouping.some((group) => group[0].item === item);

export const getItems = (grouping, item) =>
  (grouping.find((group) =>
    group.some((groupedItem) => groupedItem.item === item)
  ) || []).map(({ item }) => item);

const useItemGrouping = (items) => {
  const groupsMap = useMemo(() => createSpeakerGrouping(items), [items]);

  const isFirstInGroup = useCallback((item) => isFirst(groupsMap, item), [groupsMap]);
  const getItemsInGroup = useCallback((item) => getItems(groupsMap, item), [groupsMap]);

  return { isFirstInGroup, getItemsInGroup };
};

export default useItemGrouping;
