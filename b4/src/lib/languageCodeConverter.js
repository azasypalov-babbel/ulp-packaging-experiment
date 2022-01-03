const learnLanguageAlpha3Map = {
  DAN: 'da-DK',
  NLD: 'nl-NL',
  ENG: 'en-GB',
  FRA: 'fr-FR',
  DEU: 'de-DE',
  IND: 'id-ID',
  ITA: 'it-IT',
  NOR: 'nb-NO',
  POL: 'pl-PL',
  POR: 'pt-BR',
  RUS: 'ru-RU',
  SPA: 'es-ES',
  SWE: 'sv-SE',
  TUR: 'tr-TR',
  QMS: 'es-MX'
};

const localeMap = {
  de: 'de',
  en: 'en-us',
  /* eslint-disable camelcase */
  en_dev: 'en-us',
  en_GB: 'en-gb',
  /* eslint-enable camelcase */
  es: 'es',
  fr: 'fr',
  it: 'it',
  pl: 'pl',
  pt: 'pt-br',
  sv: 'sv'
};

export const learnLanguageAlpha3toBCP47 = (learnLanguageAlpha3) =>
  learnLanguageAlpha3Map[learnLanguageAlpha3];

export const localeToBCP47 = (locale) =>
  localeMap[locale];
