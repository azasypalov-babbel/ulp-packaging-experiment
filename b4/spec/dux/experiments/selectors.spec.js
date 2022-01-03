import { getExperimentBucket } from '../../../src/dux/experiments/selectors';

describe('experiments selectors', () => {
  const state = {
    experimentTarget: 'experiment_variation'
  };

  describe('getExperimentBucket', () => {
    test('returns the bucket variation of the given experiment', () => {
      expect(getExperimentBucket('experiment_target', state)).toEqual('experiment_variation');
    });
  });
});
