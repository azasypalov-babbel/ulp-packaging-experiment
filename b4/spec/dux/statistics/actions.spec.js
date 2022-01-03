import mockStore from '../mockStore';
import * as types from '../../../src/dux/statistics/types';
import { fetchTrainerItemsStatistics } from '../../../src/dux/statistics/actions';
import statisticsService from '../../../src/services/statisticsService';

jest.mock('../../../src/services/awsApiClient');
jest.mock('../../../src/services/statisticsService');

const locale = 'en';
const learnLanguageAlpha3 = 'FRA';

describe('statistics actions', () => {
  const state = {
    session: {
      locale: locale,
      learnLanguageAlpha3: learnLanguageAlpha3
    }
  };
  const store = mockStore(state);

  statisticsService.fetchTrainerItemsStatistics.mockImplementation(() => Promise.resolve('ok'));

  afterEach(() => {
    statisticsService.fetchTrainerItemsStatistics.mockClear();
    store.clearActions();
  });

  test('calls statistics service', () => {
    expect.assertions(2);
    const expectedActions = [
      {
        type: `${types.FETCH_TRAINER_ITEMS_STATISTICS}_PENDING`
      },
      {
        type: `${types.FETCH_TRAINER_ITEMS_STATISTICS}_FULFILLED`,
        payload: 'ok'
      }
    ];

    return store.dispatch(fetchTrainerItemsStatistics())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(statisticsService.fetchTrainerItemsStatistics).toHaveBeenCalledWith({ locale, learnLanguageAlpha3 });
      });
  });
});
