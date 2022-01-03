import mockStore from '../mockStore';
import * as types from '../../../src/dux/account/types';
import { fetchAccount } from '../../../src/dux/account/actions';
import accountService from '../../../src/services/accountService';

jest.mock('../../../src/services/accountService');

describe('Account Actions', () => {
  const state = {
    session: {
      locale: 'en'
    }
  };
  const store = mockStore(state);

  accountService.fetchAccount.mockImplementation(() => Promise.resolve('ok'));

  afterEach(() => {
    accountService.fetchAccount.mockClear();
    store.clearActions();
  });

  test('calls account service', () => {
    expect.assertions(2);
    const expectedActions = [
      {
        type: `${types.FETCH_ACCOUNT}_PENDING`
      },
      {
        type: `${types.FETCH_ACCOUNT}_FULFILLED`,
        payload: 'ok'
      }
    ];

    return store.dispatch(fetchAccount())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(accountService.fetchAccount).toHaveBeenCalledWith(state.session.locale);
      });
  });
});
