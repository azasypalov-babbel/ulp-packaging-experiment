import { useRef, useEffect } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

const useResizeObserver = (onResize) => {
  const elementRef = useRef();

  useEffect(() => {
    const resizeObserver = new ResizeObserver(([bottomLayout]) => {
      if (bottomLayout.contentRect) {
        onResize(bottomLayout.contentRect);
      }
    });

    const element = elementRef.current;

    resizeObserver.observe(element);
    return () => {
      resizeObserver.unobserve(element);
    };
  }, [elementRef, onResize]);

  return elementRef;
};

export default useResizeObserver;
