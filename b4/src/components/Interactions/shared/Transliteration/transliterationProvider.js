import { useState, useEffect } from 'react';

const preserveCapitalisation = (fn) => (input) => {
  const isLowercase = input.toLowerCase() === input;
  const output = fn(input.toLowerCase());
  if (typeof output === 'string') {
    return isLowercase ? output : output.toUpperCase();
  }
};

export const createTransliterationConfig = ({ map, ...config }) => {
  const transliterationMap = new Map();
  const detransliterationMap = new Map();

  const entries = Object.entries(map)
    .map((both) => both.map((string) => string.toLowerCase()));

  entries.forEach(([key, value]) => {
    transliterationMap.set(value, key);
    detransliterationMap.set(key, value);
  });

  return {
    ...config,
    entries,
    transliterate: preserveCapitalisation((key) => transliterationMap.get(key)),
    detransliterate: preserveCapitalisation((key) => detransliterationMap.get(key))
  };
};

export const useTransliterationProvider = (learnLanguageAlpha3 = 'RUS') => {
  const [
    transliterationConfig,
    setTransliterationConfig
  ] = useState(null);

  const isLoading = transliterationConfig === null;

  useEffect(() => {
    import(
      /* webpackChunkName: "transliterationConfig/[request]" */
      `./config/${learnLanguageAlpha3}.json`
    )
      .then((config) => setTransliterationConfig(createTransliterationConfig(config)))
      .catch(() => {});
  }, [setTransliterationConfig, learnLanguageAlpha3]);

  return {
    isLoading,
    ...(transliterationConfig || {})
  };
};
