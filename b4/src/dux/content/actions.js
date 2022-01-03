import * as types from './types';
import services from '../../services';
import * as contentReleaseSelectors from '../contentRelease/selectors';

export const fetchLearnLanguage = () => (dispatch, getState) => {
  const { contentService } = services;
  const { contentRelease, session } = getState();
  const { locale, learnLanguageAlpha3 } = session;
  const contentReleaseId = contentReleaseSelectors.contentReleaseId(contentRelease);

  return dispatch({
    type: types.FETCH_LEARN_LANGUAGE,
    payload: contentService.fetchLearnLanguage({
      locale,
      contentReleaseId,
      learnLanguageAlpha3
    })
  });
};
