import * as types from './types';
import services from '../../services';
import rollbar from '../../services/rollbarService';

export const fetchContentRelease = () => (dispatch, getState) => {
  const { contentReleaseService } = services;
  const { locale, learnLanguageAlpha3 } = getState().session;

  rollbar.warning('Fetch ContentReleaseId - not provided by the lesson url');

  return dispatch({
    type: types.FETCH_CONTENT_RELEASE,
    payload: contentReleaseService.fetchContentRelease({ locale, learnLanguageAlpha3 })
  });
};

export const setContentReleaseId = (id) => ({
  type: types.SET_CONTENT_RELEASE_ID,
  payload: id
});
