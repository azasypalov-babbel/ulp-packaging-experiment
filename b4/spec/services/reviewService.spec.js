import getAwsApiClient from '../../src/services/awsApiClient';
import { buildPath } from '../../src/lib/apiPathHelper';
import reviewService from '../../src/services/reviewService';

const locale = 'en';
const learnLanguageAlpha3 = 'DEU';
const UUID = '12345';

const mockFetch = jest.fn(() => Promise.resolve());
const mockAuthenticate = jest.fn(() => Promise.resolve(UUID));

const interactionTypes = [
  { id: 'flashcard', count: 2 },
  { id: 'speak', count: 2 },
  { id: 'write', count: 2 }
];

const reviewInteractionTypesData = {
  data: { interaction_types: interactionTypes }
};

jest.mock('../../src/services/awsApiClient');

// corresponding API versions
// @see https://doc.babbel.com/lessonnine/babbel.apigateway for more information
const VERSION_1_1_0 = '1.1.0';
const VERSION_5 = '5';

getAwsApiClient.mockImplementation(() => {
  return {
    fetch: mockFetch,
    authenticate: mockAuthenticate
  };
});


describe('Review Service', () => {
  afterEach(() => {
    mockAuthenticate.mockClear();
    mockFetch.mockClear();
    getAwsApiClient.mockClear();
  });

  describe('#getReviewTypes', () => {
    const urlParameters = {
      learnLanguageAlpha3,
      locale,
      params: {
        filter: 'due'
      }
    };

    test('returns a Promise', () => {
      mockFetch.mockImplementationOnce(() => Promise.resolve(reviewInteractionTypesData));
      const result = reviewService.getReviewTypes(urlParameters);
      expect(typeof result.then).toBe('function');
    });

    test('rejects with an error', () => {
      const errorMsg = 'Error';
      mockAuthenticate.mockImplementationOnce(() => Promise.reject(errorMsg));

      return expect(reviewService.getReviewTypes(urlParameters)).rejects.toEqual(errorMsg);
    });

    describe('with due items', () => {
      test('returns a list of interaction types', () => {
        mockFetch.mockImplementationOnce(() => Promise.resolve(reviewInteractionTypesData));
        expect.assertions(1);
        return reviewService.getReviewTypes(urlParameters)
          .then((data) => {
            expect(data).toEqual(interactionTypes);
          });
      });

      test('makes a request with correct parameters', () => {
        const version = VERSION_1_1_0;
        const expectedFetchParams = {
          verb: 'GET',
          path: buildPath({ version, locale, uuid: UUID, learnLanguageAlpha3 }, 'vocabulary/interaction_types'),
          query: {
            filter: 'due'
          }
        };
        mockFetch.mockImplementationOnce(() => Promise.resolve(reviewInteractionTypesData));

        expect.assertions(1);
        return reviewService.getReviewTypes(urlParameters)
          .then(() => {
            expect(mockFetch).toHaveBeenCalledWith(expectedFetchParams);
          });
      });
    });
  });

  describe('#getReviewItems', () => {
    const urlParameters = {
      learnLanguageAlpha3: 'DEU',
      locale: 'en',
      params: {
        filter: 'due'
      }
    };
    const reviewItemsData = {
      data: {
        foo: 'bar'
      }
    };

    test('returns a Promise', () => {
      mockFetch.mockImplementationOnce(() => Promise.resolve(reviewInteractionTypesData));
      const result = reviewService.getReviewItems(urlParameters);
      expect(typeof result.then).toBe('function');
    });

    test('makes a request with correct parameters', () => {
      const version = VERSION_5;
      const expectedFetchParams = {
        verb: 'GET',
        path: buildPath({
          version,
          locale: urlParameters.locale,
          uuid: UUID,
          learnLanguageAlpha3: urlParameters.learnLanguageAlpha3
        }, 'review_session'),
        query: {
          filter: 'due'
        }
      };

      mockFetch.mockImplementationOnce(() => Promise.resolve(reviewItemsData));
      expect.assertions(1);
      return reviewService.getReviewItems(urlParameters)
        .then(() => {
          expect(mockFetch).toHaveBeenCalledWith(expectedFetchParams);
        });
    });
  });

  describe('#updateVocabularyItems', () => {
    const params = {
      learnLanguageAlpha3,
      locale,
      vocabularyItems: [
        { id: 'abc', mistakes: 3 },
        { id: 'def', mistakes: 99 }
      ]
    };

    test('returns a Promise', () => {
      mockFetch.mockImplementationOnce(() => Promise.resolve(reviewInteractionTypesData));
      const result = reviewService.updateVocabularyItems(params);
      expect(typeof result.then).toBe('function');
    });

    test('rejects with an error', () => {
      const errorMsg = 'Error';
      mockAuthenticate.mockImplementationOnce(() => Promise.reject(errorMsg));

      return expect(reviewService.updateVocabularyItems(params)).rejects.toEqual(errorMsg);
    });

    test('makes a request with correct parameters', () => {
      const version = VERSION_5;
      const expectedFetchParams = {
        verb: 'PUT',
        path: buildPath({ version, learnLanguageAlpha3, uuid: UUID, locale }, 'review_session'),
        body: {
          review_session: {
            items: [
              { id: 'abc', mistakes: 3 },
              { id: 'def', mistakes: 99 }
            ]
          }
        }
      };

      expect.assertions(1);
      return reviewService.updateVocabularyItems(params)
        .then(() => {
          expect(mockFetch).toHaveBeenCalledWith(expectedFetchParams);
        });
    });
  });
});
