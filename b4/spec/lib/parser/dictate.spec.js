import fixture from '../../fixtures/unparsed/dictate.json';
import parseDictate from '../../../src/lib/parser/dictate';

describe('Parser', () => {
  describe('Dictate', () => {
    const parsed = parseDictate(fixture);

    test('maps the data onto a different format', () => {
      expect(parsed).toMatchSnapshot();
    });

    describe('when "interaction" is "choose"', () => {
      describe('and "dictate" is "true"', () => {
        const chooseDictateDictate = Object.assign({}, fixture, {
          interaction: 'choose',
          dictate: true
        });

        test('maps "interaction" to "ChoiceButtons"', () => {
          expect(parseDictate(chooseDictateDictate).interaction).toBe('ChoiceButtons');
        });
      });
    });

    describe('when "interaction" is "write"', () => {
      describe('and "dictate" is "true"', () => {
        const writeDictateDictate = Object.assign({}, fixture, {
          interaction: 'write',
          dictate: true
        });

        test('maps "interaction" to "Fillin"', () => {
          expect(parseDictate(writeDictateDictate).interaction).toBe('Fillin');
        });

        describe('and "puzzle_helper" is "true"', () => {
          const writeDictatePuzzleHelperDictate = Object.assign({}, fixture, {
            interaction: 'write',
            dictate: true,
            puzzle_helper: true
          });

          test('maps "interaction" to "PuzzleHelper"', () => {
            expect(parseDictate(writeDictatePuzzleHelperDictate).interaction).toBe('PuzzleHelper');
          });
        });
      });
    });

    describe('when "interaction" is "sort"', () => {
      describe('and "dictate" is "true"', () => {
        const sortDictateDictate = Object.assign({}, fixture, {
          interaction: 'sort',
          dictate: true
        });

        test('maps "interaction" to "WordOrder"', () => {
          expect(parseDictate(sortDictateDictate).interaction).toBe('WordOrder');
        });
      });
    });

    describe('when "translation_visibility" is "full"', () => {
      const fullTranslationDialog = Object.assign({}, fixture, {
        translation_visibility: 'full'
      });

      test('maps "translation" to "Show"', () => {
        expect(parseDictate(fullTranslationDialog).translation).toBe('Show');
      });
    });

    describe('when "translation_visibility" is "partial"', () => {
      const partialTranslationDialog = Object.assign({}, fixture, {
        translation_visibility: 'partial'
      });

      test('maps "translation" to "Icon"', () => {
        expect(parseDictate(partialTranslationDialog).translation).toBe('Icon');
      });
    });

    describe('when "translation_visibility" is "none"', () => {
      const noneTranslationDialog = Object.assign({}, fixture, {
        translation_visibility: 'none'
      });

      test('maps "translation" to "Hide"', () => {
        expect(parseDictate(noneTranslationDialog).translation).toBe('Hide');
      });
    });
  });
});
