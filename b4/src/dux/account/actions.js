import * as types from './types';
import services from '../../services';

export const fetchAccount = () => (dispatch, getState) => {
  const { accountService } = services;
  const { locale } = getState().session;

  return dispatch({
    type: types.FETCH_ACCOUNT,
    payload: accountService.fetchAccount(locale)
  });
};
