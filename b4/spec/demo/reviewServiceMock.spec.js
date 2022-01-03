import reviewService from '../../src/services/reviewService';
import reviewServiceMock from '../../src/demo/mocks/reviewServiceMock';

jest.mock('../../src/services/awsApiClient');

describe('Review Service Mock', () => {
  test('should mock all the methods of the reviewService', () => {
    const serviceMethods = new Set(Object.keys(reviewService));
    const mockMethods = new Set(Object.keys(reviewServiceMock));

    const diff = new Set(Array.from(serviceMethods).filter((m) => !mockMethods.has(m)));

    expect(diff.size).toBe(0);
  });
});
