import {
  normalizeQueryParameters,
  parseQueryParameters
} from '../../src/lib/urlHelpers';

describe('urlHelpers', () => {
  describe('#parseQueryParameters', () => {
    describe('when url contains query parameters', () => {
      test('returns all the query parameters', () => {
        const lessonUrl = 'http://my.babbel.dev/en_GB/lesson-player/FRA/f794e279dd51be7b8e38a047bbfcc6b5?test=ab&foo=2';

        const queryParameters = parseQueryParameters(lessonUrl);
        expect(queryParameters).toEqual({
          foo: '2',
          test: 'ab'
        });
      });

      test('camelcases to keys of all query parameters', () => {
        const lessonUrl =
          'http://my.babbel.dev/en_GB/lesson-player/FRA/f794e279dd51be7b8e38a047bbfcc6b5?test_id=ab&foo-id=2';

        const queryParameters = parseQueryParameters(lessonUrl);
        expect(queryParameters).toEqual({
          fooId: '2',
          testId: 'ab'
        });
      });
    });
  });

  describe('#normalizeQueryParameters', () => {
    describe('undefined values in query parameters', () => {
      const queryParameters = {
        filter: 'search',
        offset: undefined
      };

      test('are removed',  () => {
        expect(normalizeQueryParameters(queryParameters)).not.toHaveProperty('offset');
        expect(normalizeQueryParameters(queryParameters)).toEqual(expect.objectContaining({
          filter: 'search'
        }));
      });
    });
  });
});
