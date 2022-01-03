import { useEffect } from 'react';

export const useBackgroundColor = (color) => {
  useEffect(() => {
    const initialValue = document.body.style.backgroundColor;
    document.body.style.backgroundColor = color;
    return () => {
      document.body.style.backgroundColor = initialValue;
    };
  }, [color]);
};
