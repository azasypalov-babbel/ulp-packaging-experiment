import { useCallback, useMemo } from 'react';

export const constructPositionMap = (items) => {
  const positionMap = {};

  items.forEach((item, idx) => {
    if (!item.speakerRole) return;

    if (idx == 0) {
      positionMap[item.speakerRole] = 'left';
      return;
    }

    if (!(item.speakerRole in positionMap)) {
      const values = Object.values(positionMap);
      const lastValue = values[values.length - 1];
      positionMap[item.speakerRole] = lastValue == 'left' ? 'right' : 'left';
    }
  });

  return positionMap;
};

const usePositionMap = (items) => {
  const positionMap = useMemo(() => constructPositionMap(items), [items]);

  const getPosition = useCallback((item) => positionMap[item.speakerRole], [positionMap]);

  return [getPosition];
};

export default usePositionMap;
