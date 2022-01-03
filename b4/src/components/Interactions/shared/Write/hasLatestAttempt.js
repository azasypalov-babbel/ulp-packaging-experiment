import { useState, useEffect } from 'react';

const useHasLatestAttempt = (attempt) => {
  const [state, setState] = useState(null);

  useEffect(() => {
    const { number, pending } = attempt || {};

    if (number && !pending) {
      setState(attempt);
    }
  }, [attempt]);

  return state;
};

export default useHasLatestAttempt;
