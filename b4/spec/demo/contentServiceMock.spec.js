import contentService from '../../src/services/contentService';
import contentServiceMock from '../../src/demo/mocks/contentServiceMock';

jest.mock('../../src/services/awsApiClient');

describe('Content Service Mock', () => {
  test('should mock all the methods of the contentService', () => {
    const serviceMethods = new Set(Object.keys(contentService));
    const mockMethods = new Set(Object.keys(contentServiceMock));

    const diff = new Set(Array.from(serviceMethods).filter((m) => !mockMethods.has(m)));

    expect(diff.size).toBe(0);
  });
});
