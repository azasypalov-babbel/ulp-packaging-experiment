import { contentReleaseId } from '../../../src/dux/contentRelease/selectors';

describe('contentRelease selectors', () => {
  describe('#contentReleaseId', () => {
    describe('when not loaded yet', () => {
      const state = {
        data: null
      };

      test('returns null', () => {
        expect(contentReleaseId(state)).toEqual(null);
      });
    });

    describe('when loaded', () => {
      const state = {
        data: {
          id: 'mock-content-release-id'
        }
      };

      test('returns content release id', () => {
        expect(contentReleaseId(state)).toEqual('mock-content-release-id');
      });
    });
  });
});
