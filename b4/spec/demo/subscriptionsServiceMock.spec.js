import subscriptionsService from '../../src/services/subscriptionsService';
import subscriptionsServiceMock from '../../src/demo/mocks/subscriptionsServiceMock';

jest.mock('../../src/services/awsApiClient');

describe('Subscriptions Service Mock', () => {
  test('should mock all the methods of the subscriptionsService', () => {
    const serviceMethods = new Set(Object.keys(subscriptionsService));
    const mockMethods = new Set(Object.keys(subscriptionsServiceMock));

    const diff = new Set(Array.from(serviceMethods).filter((m) => !mockMethods.has(m)));

    expect(diff.size).toBe(0);
  });
});
