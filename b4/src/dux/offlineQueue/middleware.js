import { isOfflineAction } from './actionDecorators';
import { ONLINE } from './types';
import { isOnline } from './selectors';

export const createQueue = () => {
  const queue = new Set();
  const push = (item) => {
    queue.add(item);
  };
  const flush = (callback) => {
    queue.forEach(callback);
    queue.clear();
  };
  return {
    push,
    flush
  };
};

export const createOfflineQueueMiddleware = (queue = createQueue()) => (api) => (next) => (action) => {
  const dispatch = () => next(action);

  if (isOnline(api.getState()) === true) {
    return dispatch();
  }

  if (isOfflineAction(action)) {
    queue.push(dispatch);
    return;
  }
  dispatch();
  if (action.type === ONLINE) {
    queue.flush(next);
  }
  return action;
};

export default createOfflineQueueMiddleware();
