import getAwsApiClient from '../../src/services/awsApiClient';
import contentService, { DEFAULT_QUERY } from '../../src/services/contentService';
import { buildPathV5 } from '../../src/lib/apiPathHelper';

jest.mock('../../src/services/awsApiClient');

const locale = 'en';
const learnLanguageAlpha3 = 'DEU';
const uuid = '12345';
const contentReleaseId = 'fake-content-release-id';

const mockFetch = jest.fn(() => Promise.resolve());
const mockAuthenticate = jest.fn(() => Promise.resolve(uuid));

getAwsApiClient.mockImplementation(() => {
  return {
    fetch: mockFetch,
    authenticate: mockAuthenticate
  };
});

const urlParameters = {
  locale,
  learnLanguageAlpha3,
  contentReleaseId
};

describe('Content Service', () => {
  afterEach(() => {
    mockAuthenticate.mockClear();
  });

  describe('#fetchLearnLanguage', () => {
    test('resolves with the learn language', () => {
      const responseData = {
        data: {
          learn_language: {
            unlocked: true,
            foo_bar: 'baz'
          }
        },
        headers: {}
      };
      const camelizedLearnLanguage = {
        unlocked: true,
        fooBar: 'baz'
      };

      mockFetch.mockImplementation(() => Promise.resolve(responseData));

      expect.assertions(1);
      return contentService.fetchLearnLanguage(urlParameters)
        .then((learnLanguage) => {
          expect(learnLanguage).toMatchObject(camelizedLearnLanguage);
        });
    });

    test('rejects with an error', () => {
      const errorMsg = 'Error';
      mockAuthenticate.mockImplementationOnce(() => Promise.reject(errorMsg));

      return expect(contentService.fetchLearnLanguage(urlParameters)).rejects.toEqual(errorMsg);
    });

    describe('API client fetch', () => {
      beforeEach(() => {
        const responseData = {
          data: {
            learn_language: {
              unlocked: true
            }
          },
          headers: {}
        };
        mockFetch.mockImplementation(() => Promise.resolve(responseData));
      });

      test('gets correct parameters', () => {
        const expectedParams = {
          path: buildPathV5({ version: '2', locale, uuid, contentReleaseId, learnLanguageAlpha3 }),
          verb: 'GET',
          query: DEFAULT_QUERY
        };

        expect.assertions(1);
        return contentService.fetchLearnLanguage(urlParameters)
          .then(() => {
            expect(mockFetch).toHaveBeenCalledWith(expectedParams);
          });
      });

      describe('when custom query param is passed', () => {
        test('it fetches with custom query', () => {
          const customQuery = { foo: 'bar' };
          const expectedParams = {
            path: buildPathV5({ version: '2', locale, uuid, contentReleaseId, learnLanguageAlpha3 }),
            verb: 'GET',
            query: customQuery
          };

          expect.assertions(1);
          return contentService.fetchLearnLanguage({ ...urlParameters, query: customQuery })
            .then(() => {
              expect(mockFetch).toHaveBeenCalledWith(expectedParams);
            });
        });
      });
    });
  });
});
