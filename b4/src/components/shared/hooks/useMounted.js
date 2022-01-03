import { useCallback, useEffect, useRef } from 'react';

export const useMounted = () => {
  const mountedRef = useRef(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      mountedRef.current = true;
    });
    return () => {
      clearTimeout(timeout);
      mountedRef.current = false;
    };
  }, []);
  return useCallback(() => mountedRef.current, []);
};
