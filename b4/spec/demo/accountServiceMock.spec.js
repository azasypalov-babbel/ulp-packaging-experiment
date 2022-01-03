import accountService from '../../src/services/accountService';
import accountServiceMock from '../../src/demo/mocks/accountServiceMock';

jest.mock('../../src/services/awsApiClient');

describe('Account Service Mock', () => {
  test('should mock all the methods of the accountService', () => {
    const serviceMethods = new Set(Object.keys(accountService));
    const mockMethods = new Set(Object.keys(accountServiceMock));

    const diff = new Set(Array.from(serviceMethods).filter((m) => !mockMethods.has(m)));

    expect(diff.size).toBe(0);
  });
});
