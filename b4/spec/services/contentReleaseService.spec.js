import getAwsApiClient from '../../src/services/awsApiClient';
import contentReleaseService from '../../src/services/contentReleaseService';

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

const urlParameters = {
  locale,
  learnLanguageAlpha3
};

describe('Content Release Service', () => {
  afterEach(() => {
    mockAuthenticate.mockClear();
  });

  describe('#fetchContentRelease', () => {
    test('resolves with id, locale and learn language', () => {
      const responseData = {
        data: {
          content_release: {
            id: 'foo',
            locale: 'en',
            learn_language_alpha3: 'DEU'
          }
        }
      };
      const camelizedContentRelease = {
        id: 'foo',
        locale: 'en',
        learnLanguageAlpha3: 'DEU'
      };

      mockFetch.mockImplementation(() => Promise.resolve(responseData));

      expect.assertions(1);
      return contentReleaseService.fetchContentRelease(urlParameters)
        .then((contentRelease) => {
          expect(contentRelease).toMatchObject(camelizedContentRelease);
        });
    });

    test('rejects with an error', () => {
      const errorMsg = 'Error';
      mockAuthenticate.mockImplementationOnce(() => Promise.reject(errorMsg));

      return expect(contentReleaseService.fetchContentRelease(urlParameters)).rejects.toEqual(errorMsg);
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
        path: `v2/${locale}/accounts/${UUID}/learn_languages/${learnLanguageAlpha3}/content_release`,
        verb: 'GET'
      };

      expect.assertions(1);
      return contentReleaseService.fetchContentRelease(urlParameters)
        .then(() => {
          expect(mockFetch).toHaveBeenCalledWith(expectedParams);
        });
    });
  });
});
