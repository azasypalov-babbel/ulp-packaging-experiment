import * as types from './types';
import services from '../../services';
import { offlineAction } from '../offlineQueue/actionDecorators';

export const track = (action) => offlineAction((dispatch, getState) => {
  const eventAction = typeof action === 'function'
    ? action(getState()) // no dispatch allowed in tracking events.
    : action;

  const { trackingService } = services;
  return dispatch({
    type: types.TRACK,
    payload: () => trackingService
      .track(
        eventAction.event,
        eventAction.version,
        eventAction.payload
      )
      .then(() => eventAction)
  });
});

