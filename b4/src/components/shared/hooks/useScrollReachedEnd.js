import { useEffect, useRef } from 'react';

export const useScrollReachedEnd = ({
  onScrollReachedEnd, container = document, element, bottomOffset = 100, initialRunTimeout = 5000
}) => {
  const initialRunTimerRef = useRef(0);
  useEffect(() => {
    const callback = () => {
      clearTimeout(initialRunTimerRef.current);
      if (element?.scrollTop + window.innerHeight + bottomOffset > element?.scrollHeight) {
        onScrollReachedEnd();
      }
    };
    initialRunTimerRef.current = setTimeout(callback, initialRunTimeout);
    container.addEventListener('scroll', callback);
    return () => {
      container.removeEventListener('scroll', callback);
      clearTimeout(initialRunTimerRef.current);
    };
  }, [element, container, onScrollReachedEnd, bottomOffset, initialRunTimeout]);
};
