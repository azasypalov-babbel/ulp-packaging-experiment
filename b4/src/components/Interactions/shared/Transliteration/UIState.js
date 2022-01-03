import { useState } from 'react';

export const useTransliterationUIState = () => {
  const [active, setActive] = useState({});

  const clearActive = (name) => {
    clearTimeout(active[name]);
    setActive((active) => ({
      ...active,
      [name]: undefined
    }));
  };

  const handleOnChange = (value) => {
    const id = value.toLowerCase();

    const timer = setTimeout(() => {
      clearActive(id);
    },
    /**
     * This timer will mark the key as active for 250ms.
     * The active state is consumed in a UI component and used to animate the corresponding key.
     */
    250);

    setActive((active) => ({
      ...active,
      [id]: timer
    }));
  };

  return [
    handleOnChange,
    Object.entries(active)
      .filter(([, value]) => Boolean(value))
      .map(([key]) => key)
  ];
};
