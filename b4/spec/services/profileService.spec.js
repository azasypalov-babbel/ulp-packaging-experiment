import getAwsApiClient from '../../src/services/awsApiClient';
import profileService from '../../src/services/profileService';

jest.mock('../../src/services/awsApiClient');

const locale = 'en';
const UUID = '12345';

const mockResponseData = {
  profile: {
    email: 'user@babbel.com'
  }
};

const mockFetch = jest.fn(() => Promise.resolve());
const mockAuthenticate = jest.fn(() => Promise.resolve(UUID));

getAwsApiClient.mockImplementation(() => {
  return {
    fetch: mockFetch,
    authenticate: mockAuthenticate
  };
});

describe('Profile Service', () => {
  describe('#fetchProfile', () => {
    beforeEach(() => {
      mockFetch.mockImplementation(() => Promise.resolve({ data: mockResponseData }));
    });

    afterEach(() => {
      mockFetch.mockClear();
    });

    test('returns a Promise', () => {
      const result = profileService.fetchProfile(locale);
      expect(typeof result.then).toEqual('function');
    });

    test('resolves with an object representing the profile', async () => {
      const data = await profileService.fetchProfile(locale);
      expect(data).toEqual(mockResponseData.profile);
    });
  });
});
