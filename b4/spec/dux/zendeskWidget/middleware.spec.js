import { FETCH_ACCOUNT } from '../../../src/dux/account/types';
import zendeskWidgetMiddleware from '../../../src/dux/zendeskWidget/middleware';
import * as zendeskActions from '../../../src/dux/zendeskWidget/actions';

jest.mock('../../../src/dux/zendeskWidget/actions', () => ({
  init: jest.fn(() => ({ type: 'ZENDESK_WIDGET/FAKE_INIT' }))
}));

// https://redux.js.org/recipes/writing-tests#middleware
const create = () => {
  const store = {
    getState: jest.fn(() => ({})),
    dispatch: jest.fn()
  };

  const next = jest.fn();

  const invoke = (action) => zendeskWidgetMiddleware(store)(next)(action);

  return { store, next, invoke };
};

describe('Survey Middleware', () => {
  describe('for a FETCH_ACCOUNT_FULFILLED action', () => {
    it('passes through the action', () => {
      const { next, invoke } = create();
      const action = { type: `${FETCH_ACCOUNT}_FULFILLED` };
      invoke(action);
      expect(next).toHaveBeenCalledWith(action);
    });

    it('dispatches zendeskWidget init', () => {
      const { store, invoke } = create();
      const action = { type: `${FETCH_ACCOUNT}_FULFILLED` };
      invoke(action);
      expect(zendeskActions.init).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith({ type: 'ZENDESK_WIDGET/FAKE_INIT' });
    });
  });

  describe('for another action', () => {
    it('passes through the action', () => {
      const { next, invoke } = create();
      const action = { type: 'FOO' };
      invoke(action);
      expect(next).toHaveBeenCalledWith(action);
    });

    it('does not dispatch anything else', () => {
      const { store, invoke } = create();
      const action = { type: 'FOO' };
      invoke(action);
      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });
});
