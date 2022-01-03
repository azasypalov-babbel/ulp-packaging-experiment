jest.mock('../../../src/dux/offlineQueue/selectors');

import createMockStore from 'redux-mock-store';
import { createOfflineQueueMiddleware, createQueue } from '../../../src/dux/offlineQueue/middleware';
import { offlineAction } from '../../../src/dux/offlineQueue/actionDecorators';
import { ONLINE } from '../../../src/dux/offlineQueue/types';
import * as selectors from '../../../src/dux/offlineQueue/selectors';

const SOME_ACTION = 'some_action';
const DEFAULT_ACTION = { type: SOME_ACTION };
const OFFLINE_ACTION_FUNC = offlineAction((dispatch) => dispatch(DEFAULT_ACTION));


const createSpyMiddleware = (callback) => () => (next) => {
  const dispatch = (action) => {
    callback(action);
    if (typeof action === 'function') {
      return action(dispatch);
    }
    return next(action);
  };
  return dispatch;
};

describe('offlineQueueMiddleware', () => {
  afterAll(() => {
    jest.unmock('../../../src/dux/offlineQueue/selectors');
  });

  describe('#online', () => {
    const queue = createQueue();

    jest.spyOn(queue, 'push');
    jest.spyOn(queue, 'flush');

    const middleware = createOfflineQueueMiddleware(queue);
    const logDispatch = jest.fn();
    const spyMiddleware = createSpyMiddleware(logDispatch);

    const store = createMockStore([middleware, spyMiddleware])({});

    beforeAll(() => {
      selectors.isOnline.mockImplementation(() => true);
    });

    test('does not queue actions', () => {
      store.dispatch({ type: SOME_ACTION });
      store.dispatch(OFFLINE_ACTION_FUNC);

      expect(queue.push).toHaveBeenCalledTimes(0);
      expect(logDispatch).toHaveBeenCalledWith(OFFLINE_ACTION_FUNC);
    });
  });


  describe('#offline', () => {
    const queue = createQueue();

    jest.spyOn(queue, 'push');
    jest.spyOn(queue, 'flush');

    const middleware = createOfflineQueueMiddleware(queue);
    const logDispatch = jest.fn();
    const spyMiddleware = createSpyMiddleware(logDispatch);

    const store = createMockStore([middleware, spyMiddleware])({});

    beforeAll(() => {
      selectors.isOnline.mockImplementation(() => false);
    });

    test('does queue offline actions', () => {
      store.dispatch(OFFLINE_ACTION_FUNC);
      expect(queue.push).toHaveBeenCalledTimes(1);
      expect(logDispatch).not.toHaveBeenCalledWith(OFFLINE_ACTION_FUNC);
    });

    test('does dispatch others', () => {
      store.dispatch(DEFAULT_ACTION);
      expect(logDispatch).toHaveBeenCalledWith(DEFAULT_ACTION);
    });


    test('until online', ()=> {
      logDispatch.mockClear();
      store.dispatch({ type: ONLINE });
      expect(queue.flush).toHaveBeenCalledTimes(1);
      expect(logDispatch).toHaveBeenCalledWith(OFFLINE_ACTION_FUNC);
      expect(logDispatch).toHaveBeenCalledWith(DEFAULT_ACTION);
    });
  });
});
