import example from '../../fixtures/unparsed/spokenreview.json';
import parse from '../../../src/lib/parser/spokenreview';

describe('Parser', () => {
  describe('spokenreview', () => {
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
