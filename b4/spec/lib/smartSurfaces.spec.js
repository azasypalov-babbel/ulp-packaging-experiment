import * as features from '../../src/lib/features';
jest.mock('../../src/lib/features');

const mockGetLocalStorage = jest.fn();
jest.mock('../../src/lib/localStorage', () => ({
  getLocalStorage: () => ({
    set: jest.fn(),
    get: mockGetLocalStorage
  })
}));

const mockFeatureFlag = (shouldAllow) => {
  features.get.mockImplementation((featureName) => {
    if (featureName !== 'is_refer_a_friend') {
      throw new Error(`incorrect feature flag name: ${featureName}`);
    }

    return shouldAllow;
  });
};

describe('smartSurfaces feature helpers', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { isAllowedReferAFriend } = require('../../src/lib/smartSurfaces');

  describe('#isAllowedReferAFriend', () => {
    beforeEach(() => {
      mockFeatureFlag(true);
      mockGetLocalStorage.mockReturnValue(null);
    });

    it('returns true', () => {
      expect(isAllowedReferAFriend()).toEqual(true);
    });

    it('returns false if value set in localStorage', () => {
      mockGetLocalStorage.mockReturnValue({ 'SMURFS/LES.SeenRaF': true });
      expect(isAllowedReferAFriend()).toEqual(false);
    });

    it('returns false if feature is flagged as being disabled', () => {
      mockFeatureFlag(false);
      expect(isAllowedReferAFriend()).toEqual(false);
    });
  });
});
