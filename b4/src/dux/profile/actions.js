import * as types from './types';
import services from '../../services';

export const fetchProfile = () => (dispatch, getState) => {
  const { profileService } = services;
  const { locale } = getState().session;

  return dispatch({
    type: types.FETCH_PROFILE,
    payload: profileService.fetchProfile(locale)
  });
};
