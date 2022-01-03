/*
 * Requires all json files produced by `wti pull` and returns them in translations object
 */

import getTranslationsContext from './getContext';

const getTranslations = () => {
  const context = getTranslationsContext();

  // input: `./en_gb.json` output: `en-gb`
  const getLocale = (path) => {
    var matches = path.match(/[\w]+(?=\.json$)/);
    return matches ? matches[0] : null;
  };

  const translations = {};
  context.keys().forEach((file) => {
    const locale = getLocale(file);
    if (locale) {
      translations[locale] = context(file);
    }
  });

  return translations;
};

export default getTranslations;
