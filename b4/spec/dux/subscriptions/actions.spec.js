import mockStore from '../mockStore';
import * as types from '../../../src/dux/subscriptions/types';
import { fetchSubscriptions } from '../../../src/dux/subscriptions/actions';
import subscriptionsService from '../../../src/services/subscriptionsService';

jest.mock('../../../src/services/subscriptionsService');

describe('Subscription Actions', () => {
  const state = {
    session: {
      locale: 'en'
    }
  };
  const store = mockStore(state);

  subscriptionsService.fetchSubscriptions.mockImplementation(() => Promise.resolve('ok'));

  afterEach(() => {
    subscriptionsService.fetchSubscriptions.mockClear();
    store.clearActions();
  });

  test('calls subscriptions service', async () => {
    const expectedActions = [
      {
        type: `${types.FETCH_SUBSCRIPTIONS}_PENDING`
      },
      {
        type: `${types.FETCH_SUBSCRIPTIONS}_FULFILLED`,
        payload: 'ok'
      }
    ];

    await store.dispatch(fetchSubscriptions());
    expect(store.getActions()).toEqual(expectedActions);
    expect(subscriptionsService.fetchSubscriptions).toHaveBeenCalledWith(state.session.locale);
  });
});
