import getAwsApiClient from '../../src/services/awsApiClient';
import accountService from '../../src/services/accountService';

jest.mock('../../src/services/awsApiClient');

const locale = 'en';
const UUID = '12345';

const mockResponseData = {
  account: {
    uuid: UUID,
    displayname: 'User',
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

describe('Account Service', () => {
  describe('#fetchAccount', () => {
    beforeEach(() => {
      mockFetch.mockImplementation(() => Promise.resolve({ data: mockResponseData }));
    });

    afterEach(() => {
      mockFetch.mockClear();
    });

    test('returns a Promise', () => {
      const result = accountService.fetchAccount(locale);
      expect(typeof result.then).toEqual('function');
    });

    test('resolves with an object representing the account', () => {
      expect.assertions(1);

      return accountService.fetchAccount(locale)
        .then((data) => {
          expect(data).toEqual(mockResponseData.account);
        });
    });
  });
});
