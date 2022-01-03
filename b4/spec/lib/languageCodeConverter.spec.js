import { learnLanguageAlpha3toBCP47, localeToBCP47 } from '../../src/lib/languageCodeConverter';

describe('languageCodeConverter', () => {
  describe('#learnLanguageAlpha3toBCP47', () => {
    const knownLearnLanguageAlpha3s = [
      'DAN',
      'NLD',
      'ENG',
      'FRA',
      'DEU',
      'IND',
      'ITA',
      'NOR',
      'POL',
      'POR',
      'RUS',
      'SPA',
      'SWE',
      'TUR',
      'QMS'
    ];

    test('it maps known locales', () => {
      expect(knownLearnLanguageAlpha3s.map((learnLanguageAlpha3) => ({
        [learnLanguageAlpha3]: learnLanguageAlpha3toBCP47(learnLanguageAlpha3)
      }))).toMatchSnapshot();
    });

    test('it falls back to undefined', () => {
      expect(learnLanguageAlpha3toBCP47('XYZ')).toEqual(undefined);
    });
  });

  describe('#localeToBCP47', () => {
    const knownLocales = [
      'de',
      'en',
      'en_dev',
      'en_GB',
      'es',
      'fr',
      'it',
      'pl',
      'pt',
      'sv'
    ];

    test('it maps known locales', () => {
      expect(knownLocales.map((locale) => ({
        [locale]: localeToBCP47(locale)
      }))).toMatchSnapshot();
    });

    test('it falls back to the locale', () => {
      expect(localeToBCP47('xy')).toEqual(undefined);
    });
  });
});
