import * as types from './types';
import services from '../../services';
import cookies from '../../lib/cookies';

export const loadSurvey = () => (dispatch, getState) => {
  const {
    surveyService
  } = services;

  const state = getState();

  const surveyOptions = {
    locale: state.session.locale,
    uuid: state.account.data.uuid,
    createdAt: state.account.data.createdAt,
    canLearn: state.content.data.unlocked,
    learnLanguageAlpha3: state.session.learnLanguageAlpha3,
    lessonUuid: state.lesson.lessonUuid
  };

  surveyService.loadSurvey(surveyOptions);

  dispatch({
    type: types.LOAD_SURVEY
  });

  const cookieExpirationDate = new Date();
  cookieExpirationDate.setDate(cookieExpirationDate.getDate() + 30);
  cookies.setCookie('campaign_opened', 1, cookieExpirationDate);
};
