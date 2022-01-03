import example from '../../fixtures/unparsed/comprehension.json';
import parse from '../../../src/lib/parser/comprehension';

describe('Parser', () => {
  describe('Comprehension', () => {
    const parsed = parse(example);

    test('maps the data onto a different format', () => {
      expect(parsed).toMatchSnapshot();
    });

    test('is formatting data in a specific order', () => {
      const expectedParsedFormatType = ['title', 'description', 'Phrase', 'Phrase', 'Phrase', 'Task', 'Task', 'Task'];
      const parsedTypes = parsed.traineritems.map((item) => item.type);

      expect(parsedTypes).toEqual(expectedParsedFormatType);
    });

    describe('first parsed item', () => {
      test('is "title"', () => {
        expect(parsed.traineritems[0].type).toBe('title');
      });

      test('uses the title of unparsed input as "l1_text"', () => {
        expect(parsed.traineritems[0].l1_text).toBe(example.title);
      });
    });


    describe('second parsed item', () => {
      test('is "description"', () => {
        expect(parsed.traineritems[1].type).toBe('description');
      });

      test('uses the description of unparsed input as "l1_text"', () => {
        expect(parsed.traineritems[1].l1_text).toBe(example.description);
      });
    });

    describe('when dictate flag is true', () => {
      const audioComprehension = Object.assign({}, example, {
        dictate: true
      });

      test('maps "mode" to "AudioDialog"', () => {
        expect(parse(audioComprehension).mode).toBe('AudioDialog');
      });
    });

    describe('when dictate flag is false', () => {
      const textComprehension = Object.assign({}, example, {
        dictate: false
      });

      test('maps "mode" to "Text"', () => {
        expect(parse(textComprehension).mode).toBe('Text');
      });
    });

    describe('when "translation_visibility" is "full"', () => {
      const fullTranslationComprehension = Object.assign({}, example, {
        translation_visibility: 'full'
      });

      test('maps "translation" to "Show"', () => {
        expect(parse(fullTranslationComprehension).translation).toBe('Show');
      });
    });

    describe('when "translation_visibility" is "partial"', () => {
      const partialTranslationComprehension = Object.assign({}, example, {
        translation_visibility: 'partial'
      });

      test('maps "translation" to "Icon"', () => {
        expect(parse(partialTranslationComprehension).translation).toBe('Icon');
      });
    });

    describe('when "translation_visibility" is "none"', () => {
      const noneTranslationComprehension = Object.assign({}, example, {
        translation_visibility: 'none'
      });

      test('maps "translation" to "Hide"', () => {
        expect(parse(noneTranslationComprehension).translation).toBe('Hide');
      });
    });
  });
});
