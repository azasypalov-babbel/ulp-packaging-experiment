import mockStore from '../mockStore';
import * as types from '../../../src/dux/experiments/types';
import { fetchExperimentBucket } from '../../../src/dux/experiments/actions';
import abTesterService from '../../../src/services/abTesterService';
import camelize from 'camelize';

jest.mock('../../../src/services/awsApiClient');
jest.mock('../../../src/services/abTesterService');

describe('Experiments Actions', () => {
  const locale = 'en';
  const learnLanguageAlpha3 = 'DEU';
  const state = {
    session: {
      locale,
      learnLanguageAlpha3
    }
  };
  const store = mockStore(state);

  abTesterService.getExperimentBucket.mockImplementation(() => Promise.resolve('experiment_bucket'));

  afterEach(() => {
    abTesterService.getExperimentBucket.mockClear();
    store.clearActions();
  });

  test('dispatch FETCH_EXPERIMENT_BUCKET action', () => {
    expect.assertions(1);

    const target = 'experiment_target';
    const expectedActions = [
      {
        type: `${types.FETCH_EXPERIMENT_BUCKET}_PENDING`
      },
      {
        type: `${types.FETCH_EXPERIMENT_BUCKET}_FULFILLED`,
        payload: {
          target: 'experimentTarget',
          variation: 'experiment_bucket'
        }
      }
    ];

    return store.dispatch(fetchExperimentBucket(target))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  test('calls ab tester service', () => {
    expect.assertions(1);
    const target = 'experiment_target';

    return store.dispatch(fetchExperimentBucket(target))
      .then(() => {
        expect(abTesterService.getExperimentBucket).toHaveBeenCalledWith({
          locale,
          learnLanguageAlpha3,
          target
        });
      });
  });

  test('returns target and variation of the experiment', () => {
    expect.assertions(1);
    const target = 'experiment_target';

    return store.dispatch(fetchExperimentBucket(target))
      .then((payload) => {
        expect(payload.value).toEqual({
          target: camelize(target),
          variation: 'experiment_bucket'
        });
      });
  });
});
