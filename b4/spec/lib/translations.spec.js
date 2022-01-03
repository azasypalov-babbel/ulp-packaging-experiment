import getTranslations from '../../src/lib/translations/index';
import getContext from '../../src/lib/translations/getContext';

const mockKeys = jest.fn(() => (['./en_gb.json']));
const mockContext = jest.fn();

jest.mock('../../src/lib/translations/getContext');
getContext.mockImplementation(() => {
  const contextObj = mockContext;
  contextObj.keys = mockKeys;
  return contextObj;
});

describe('Translations', () => {
  afterEach(() => {
    mockKeys.mockClear();
    mockContext.mockClear();
  });

  describe('#getTranslations', () => {
    test('fetches context for each PATH supplied', () => {
      const PATHS = ['./de.json', './en_gb.json'];
      mockKeys.mockReturnValue(PATHS);
      getTranslations();

      expect(mockContext).toHaveBeenCalledTimes(PATHS.length);
      expect(mockContext.mock.calls[0][0]).toEqual(PATHS[0]);
      expect(mockContext.mock.calls[1][0]).toEqual(PATHS[1]);
    });

    test('only fetches JSON files', () => {
      const PATHS = ['./de.js', './en_gb.json'];
      mockKeys.mockReturnValue(PATHS);
      getTranslations();

      expect(mockContext).toHaveBeenCalledTimes(1);
    });

    test('returns empty object if no files present', () => {
      const PATHS = [];
      mockKeys.mockReturnValue(PATHS);
      var translations = getTranslations();

      expect(translations).toEqual({});
    });

    test('concatenates all locales data in PATHS', () => {
      const DE_LOCALE = { learning: { work: 'arbeit' } };
      const EN_GB_LOCALE = { learning: { work: 'work' } };
      const PATHS = ['./de.json', './en_gb.json'];

      mockKeys.mockReturnValue(PATHS);
      mockContext.mockImplementation((file) => {
        if (file === PATHS[0]) return DE_LOCALE;
        if (file === PATHS[1]) return EN_GB_LOCALE;
      });

      const translations = getTranslations();

      expect(translations['de']).toEqual(DE_LOCALE);
      expect(translations['en_gb']).toEqual(EN_GB_LOCALE);
    });
  });
});
