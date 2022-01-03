import speechRecognitionSubstitutionsService from '../../../../src/services/speechRecognition/substitutions/service';
import getAwsApiClient from '../../../../src/services/awsApiClient';

const { fetchSubstitutions } = speechRecognitionSubstitutionsService;

jest.mock('../../../../src/services/awsApiClient');

const mockData = { data: { speech_recognition_substitutions: [] } };

const mockFetch = jest.fn(() => Promise.resolve(mockData));

getAwsApiClient.mockImplementation(() => ({ fetch: mockFetch }));

const params = { locale: 'en', learnLanguageAlpha3: 'DEU' };

describe('Speech Recognition Substitutions Service', () => {
  afterEach(() => {
    mockFetch.mockClear();
  });

  describe('#fetchSubstitutions', () => {
    test('returns a Promise', () => {
      const result = fetchSubstitutions(params);
      expect(typeof result.then).toEqual('function');
    });

    test('calls fetch with valid params', () => {
      expect.assertions(1);
      return fetchSubstitutions(params).then(() => {
        expect(mockFetch).toHaveBeenCalledWith({
          path: 'v1.0.0/en/speech_recognition_substitutions',
          query: {
            learn_language_alpha3: 'DEU'
          },
          verb: 'GET'
        });
      });
    });
  });
});
