import { useCallback, useMemo, useState } from 'react';

const useSequenceIndex = (init = 0) => {
  const [index, setState] = useState(init);
  const next = useCallback(() => {
    setState((value) => value + 1);
  }, []);
  return {
    index,
    next
  };
};

export const useSequence = (elements, initialIndex = -1) => {
  const { index, next } = useSequenceIndex(initialIndex);
  const element = useMemo(() => elements[index], [index, elements]);
  const isLast = elements.length === index + 1;
  return {
    isLast,
    element,
    elements,
    index,
    next
  };
};
