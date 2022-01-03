import example from '../../fixtures/unparsed/vocabulary.json';
import parse from '../../../src/lib/parser/vocabulary';

describe('Parser', () => {
  describe('Vocabulary', () => {
    const parsed = parse(example);

    test('maps the data onto a different format', () => {
      expect(parsed).toMatchSnapshot();
    });

    describe('first parsed item', () => {
      test('is "title"', () => {
        expect(parsed.traineritems[0].type).toBe('title');
      });
      test('uses the title of unparsed input as "l1_text"', () => {
        expect(parsed.traineritems[0].l1_text).toBe(example.title);
      });
    });
  });
});
