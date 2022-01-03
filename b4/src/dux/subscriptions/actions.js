import * as types from './types';
import services from '../../services';

export const fetchSubscriptions = () => (dispatch, getState) => {
  const { subscriptionsService } = services;
  const { locale } = getState().session;

  return dispatch({
    type: types.FETCH_SUBSCRIPTIONS,
    payload: subscriptionsService.fetchSubscriptions(locale)
  });
};
