import { COMPLETE_LESSON } from '../lesson/types';
import { loadSurvey } from '../survey/actions';
import cookies from '../../lib/cookies';

const survey = (store) => (next) => (action) => {
  const result = next(action);

  const cookie = cookies.getCookie('campaign_opened');
  if (action.type === `${COMPLETE_LESSON}_FULFILLED` && !cookie) {
    store.dispatch(loadSurvey());
  }

  return result;
};

export default survey;
