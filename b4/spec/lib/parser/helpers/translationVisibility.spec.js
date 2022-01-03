import translationVisibility from '../../../../src/lib/parser/helpers/translationVisibility';

describe('translationVisibility', () => {
  describe('when is the visibility is "full"', () => {
    test('returns the visibility as "Show"', () => {
      expect(translationVisibility('full')).toEqual('Show');
    });
  });

  describe('when is the visibility is "partial"', () => {
    test('returns the visibility as "Icon"', () => {
      expect(translationVisibility('partial')).toEqual('Icon');
    });
  });

  describe('when is the visibility is "none"', () => {
    test('returns the visibility as "Hide"', () => {
      expect(translationVisibility('none')).toEqual('Hide');
    });
  });
});
