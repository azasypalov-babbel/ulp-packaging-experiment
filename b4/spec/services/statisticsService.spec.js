import getAwsApiClient from '../../src/services/awsApiClient';
import statisticsService from '../../src/services/statisticsService';

jest.mock('../../src/services/awsApiClient');

const locale = 'en';
const learnLanguageAlpha3 = 'DEU';
const UUID = '12345';

const mockFetch = jest.fn(() => Promise.resolve());
const mockAuthenticate = jest.fn(() => Promise.resolve(UUID));

getAwsApiClient.mockImplementation(() => {
  return {
    fetch: mockFetch,
    authenticate: mockAuthenticate
  };
});

describe('Statistics Service', () => {
  afterEach(() => {
    mockAuthenticate.mockClear();
  });

  describe('#fetchTrainerItemsStatistics', () => {
    const responseData = {
      data: {
        statistics: {
          due_vocabulary_count: 420,
          knowledge_levels: [
            { level: 0, number_of_items: 42 },
            { level: 1, number_of_items: 42 },
            { level: 2, number_of_items: 2 },
            { level: 3, number_of_items: 4 },
            { level: 4, number_of_items: 420 },
            { level: 5, number_of_items: 0 }
          ],
          next_session_count: 42,
          score: 200,
          total_vocabulary_count: 4200
        }
      }
    };

    const urlParameters = {
      locale,
      learnLanguageAlpha3
    };


    test('resolves with trainer items stats', () => {
      const camelizedData = {
        dueVocabularyCount: 420,
        knowledgeLevels: [
          { level: 0, numberOfItems: 42 },
          { level: 1, numberOfItems: 42 },
          { level: 2, numberOfItems: 2 },
          { level: 3, numberOfItems: 4 },
          { level: 4, numberOfItems: 420 },
          { level: 5, numberOfItems: 0 }
        ],
        nextSessionCount: 42,
        score: 200,
        totalVocabularyCount: 4200
      };

      mockFetch.mockImplementation(() => Promise.resolve(responseData));

      expect.assertions(1);
      return statisticsService.fetchTrainerItemsStatistics(urlParameters)
        .then((data) => {
          expect(data).toMatchObject(camelizedData);
        });
    });

    test('rejects with an error', () => {
      const errorMsg = 'Error';
      mockAuthenticate.mockImplementationOnce(() => Promise.reject(errorMsg));

      return expect(statisticsService.fetchTrainerItemsStatistics(urlParameters)).rejects.toEqual(errorMsg);
    });

    test('API client fetch gets correct parameters', () => {
      const responseData = {
        data: {
          content_release: {
            id: 'foo',
            locale: 'en',
            learn_language_alpha3: 'DEU'
          }
        }
      };
      mockFetch.mockImplementation(() => Promise.resolve(responseData));
      const expectedParams = {
        path: `v1.1.0/${locale}/accounts/${UUID}/learn_languages/${learnLanguageAlpha3}/trainer_items/statistics`,
        verb: 'GET'
      };

      expect.assertions(1);
      return statisticsService.fetchTrainerItemsStatistics(urlParameters)
        .then(() => {
          expect(mockFetch).toHaveBeenCalledWith(expectedParams);
        });
    });
  });
});
