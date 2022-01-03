import example from '../../fixtures/unparsed/matching.json';
import parse from '../../../src/lib/parser/matching';

describe('Parser', () => {
  describe('Matching', () => {
    const parsed = parse(example);

    test('maps the data onto a different format', () => {
      expect(parsed).toMatchSnapshot();
    });

    test('is formatting data is in the specific order', () => {
      const expectedParsedFormatType = ['title', 'Phrase', 'Phrase'];
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

    describe('when the "learn_language_text" contains "_")', () => {
      const expectedFormat = '((Allah\'a))((ısmarladık.))';

      test('converts into classic trainer format', () => {
        const convertedFormat = parsed.traineritems[1].l2_text;
        expect(convertedFormat).toBe(expectedFormat);
      });
    });
  });
});
