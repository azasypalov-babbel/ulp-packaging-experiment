import {
  getReviewQueryParams,
  filterInteractionTypes,
  countReviewItems
} from '../../../src/dux/review/helpers';
import { parseQueryParameters } from '../../../src/lib/urlHelpers';
import { isAnalyzerLibRecognizerSupported } from '../../../src/lib/speechHelper';

jest.mock('../../../src/lib/urlHelpers');
jest.mock('../../../src/lib/speechHelper');

describe('review dux helpers', () => {
  describe('#getSearchQueryParams', () => {
    describe('with REVIEW_DUE session type', () => {
      test('returns due filter param', () => {
        expect(getReviewQueryParams('REVIEW_DUE')).toEqual({ filter: 'due' });
      });
    });

    describe('with REVIEW_SEARCH session type', () => {
      const expectedParams = {
        package_id: 123,
        knowledge_level: 2,
        q: 'Hello',
        filter: 'search'
      };

      beforeEach(() => {
        parseQueryParameters.mockReturnValue({
          packageId: 123,
          level: 2,
          search: 'Hello',
          iGetRemoved: 'after parsing'
        });
      });

      afterEach(() => {
        parseQueryParameters.mockClear();
      });

      test('maps query params', () => {
        expect(getReviewQueryParams('REVIEW_SEARCH')).toEqual(expectedParams);
      });
    });
  });

  describe('#filterInteractionTypes', () => {
    describe('with speech not supported', () => {
      test('removes speech interaction type', () => {
        isAnalyzerLibRecognizerSupported.mockReturnValue(false);

        const interactionTypes = [
          { id: 'flashcard', count: 35 },
          { id: 'speak', count: 35 },
          { id: 'write', count: 35 }
        ];

        const expectedTypes = [
          { id: 'flashcard', count: 35 },
          { id: 'write', count: 35 }
        ];

        expect(filterInteractionTypes(interactionTypes)).toEqual(expectedTypes);
      });
    });

    describe('with less than 4 speech items', () => {
      test('removes speech interaction type', () => {
        isAnalyzerLibRecognizerSupported.mockReturnValue(true);

        const interactionTypes = [
          { id: 'flashcard', count: 35 },
          { id: 'speak', count: 3 },
          { id: 'write', count: 35 }
        ];

        const expectedTypes = [
          { id: 'flashcard', count: 35 },
          { id: 'write', count: 35 }
        ];

        expect(filterInteractionTypes(interactionTypes)).toEqual(expectedTypes);
      });
    });

    describe('with more than 3 speech items', () => {
      test('returns untouched interaction types', () => {
        isAnalyzerLibRecognizerSupported.mockReturnValue(true);

        const interactionTypes = [
          { id: 'flashcard', count: 35 },
          { id: 'speak', count: 35 },
          { id: 'write', count: 35 }
        ];

        const expectedTypes = [
          { id: 'flashcard', count: 35 },
          { id: 'speak', count: 35 },
          { id: 'write', count: 35 }
        ];

        expect(filterInteractionTypes(interactionTypes)).toEqual(expectedTypes);
      });
    });
  });

  describe('#countReviewItems', () => {
    const trainers = [
      {
        item_groups: [
          {
            items: [
              { id: 1 },
              { id: 2  }
            ]
          },
          {
            items: [
              { id: 2 }
            ]
          }
        ]
      },
      {
        item_groups: [
          {
            items: [
              { id: 1 }
            ]
          },
          {
            items: []
          }
        ]
      }
    ];

    test('counts all review type items from vocabulary', () => {
      expect(countReviewItems(trainers)).toBe(4);
    });
  });
});
