import * as trackerType from '../tracker/types';
import { addMessage } from '../messages/actions';
import { MESSAGE_KEYS } from '../messages/messageKeys';
import rollbar from '../../services/rollbarService';
import * as experimentTypes from '../experiments/types';

const isPromise = (obj) => {
  return Boolean(obj) && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
};

const errorMiddleware = (store) => (next) => (action) => {
  if (!isPromise(action.payload)) {
    return next(action);
  }

  return next(action).catch((error) => {
    const isNetworkError =
      (error instanceof Error && error.status === 0) ||
      (error instanceof Error && error.request instanceof XMLHttpRequest && !error.response);

    const isUnhandledActionException = error instanceof Error;

    if (isNetworkError) {
      const networkErrorWhitelist = [
        trackerType.TRACK
      ];

      if (!networkErrorWhitelist.includes(action.type)) {
        rollbar.debug(`NetworkError@${action.type}: offline`, { error });
        store.dispatch(addMessage(MESSAGE_KEYS.NETWORK));
      }
    } else if (isUnhandledActionException) {
      const nonCriticalErrorList = [
        experimentTypes.FETCH_EXPERIMENT_BUCKET
      ];

      const message = `UnhandledActionException@${action.type}: ${error.message}`;

      if (!nonCriticalErrorList.includes(action.type)) {
        store.dispatch(addMessage(MESSAGE_KEYS.GENERIC));
      }

      rollbar.error(message, { error });
      console.warn(message);
    } else {
      const message = `UnhandledActionRejection@${action.type}`;
      rollbar.error(message, { error });
      console.warn(message);
    }

    return error;
  });
};

export default errorMiddleware;
