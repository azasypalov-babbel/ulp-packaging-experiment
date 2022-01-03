import profileService from '../../src/services/profileService';
import profileServiceMock from '../../src/demo/mocks/profileServiceMock';

jest.mock('../../src/services/awsApiClient');

describe('Profile Service Mock', () => {
  test('should mock all the methods of the profileService', () => {
    const serviceMethods = new Set(Object.keys(profileService));
    const mockMethods = new Set(Object.keys(profileServiceMock));

    const diff = new Set(Array.from(serviceMethods).filter((m) => !mockMethods.has(m)));

    expect(diff.size).toBe(0);
  });
});
