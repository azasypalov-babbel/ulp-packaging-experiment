import { useRef, useState } from 'react';

const TIME_TO_STALE = 5000;

const useActiveGapStale = (enabled) => {
  const [stale, setStale] = useState(false);

  const timer = useRef();

  const handleKeyUp = (event) => {
    if (!enabled) return;
    clearTimeout(timer.current);

    const currentText = event.target.value;
    const newTimer = setTimeout(() => {
      if (currentText.length > 0) {
        setStale(true);
      }
    }, TIME_TO_STALE);

    timer.current = newTimer;
  };

  const handleBlur = () => {
    clearTimeout(timer.current);
    setStale(false);
  };

  return [handleKeyUp, handleBlur, stale];
};

export default useActiveGapStale;

