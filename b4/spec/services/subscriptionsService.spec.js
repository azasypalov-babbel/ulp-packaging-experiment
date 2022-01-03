import getAwsApiClient from '../../src/services/awsApiClient';
import subscriptionsService from '../../src/services/subscriptionsService';

jest.mock('../../src/services/awsApiClient');

const locale = 'en';
const UUID = '12345';

const mockResponseData = {
  subscriptions: [{
    startStateDate: '2018-11-25'
  }]
};

const mockFetch = jest.fn(() => Promise.resolve());
const mockAuthenticate = jest.fn(() => Promise.resolve(UUID));

getAwsApiClient.mockImplementation(() => {
  return {
    fetch: mockFetch,
    authenticate: mockAuthenticate
  };
});

describe('Subscriptions Service', () => {
  describe('#fetchSubscriptions', () => {
    beforeEach(() => {
      mockFetch.mockImplementation(() => Promise.resolve({ data: mockResponseData }));
    });

    afterEach(() => {
      mockFetch.mockClear();
    });

    test('returns a Promise', () => {
      const result = subscriptionsService.fetchSubscriptions(locale);
      expect(typeof result.then).toEqual('function');
    });

    test('resolves with an object representing the subscriptions', async () => {
      const data = await subscriptionsService.fetchSubscriptions(locale);
      expect(data).toEqual(mockResponseData.subscriptions);
    });
  });
});
