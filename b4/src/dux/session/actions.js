import * as types from './types';
import * as sessionSelectors from './selectors';
import * as features from '../../lib/features';
import services from '../../services';

export const initSession = (params) => ({
  type: types.INIT_SESSION,
  payload: params
});

export const confirmLearningTip = () => ({
  type: types.CONFIRM_LEARNING_TIP
});

export const confirmLessonLandingScreen = () => ({
  type: types.CONFIRM_LESSON_LANDING_SCREEN
});

export const dismissUnsupportedBrowserWarning = () => ({
  type: types.DISMISS_UNSUPPORTED_BROWSER_WARNING
});

export const navigateToReturnUrl = () => (dispatch, getState) => {
  const isLesson = sessionSelectors.isLesson(getState().session);
  const isReview = sessionSelectors.isReview(getState().session);

  const { returnUrl } = getState().session;
  let navigatingUrl = '';

  if (returnUrl) {
    navigatingUrl = returnUrl;
  } else if (isLesson) {
    navigatingUrl = `/dashboard`;
  } else if (isReview) {
    navigatingUrl = `/review-manager`;
  }

  services.navigationService.assign(decodeURIComponent(navigatingUrl));
};

export const navigateToPriceUrl = () => (dispatch, getState) => {
  if (features.isWebview()) {
    const message = {
      type: 'CLOSE_APP'
    };

    window.webkit.messageHandlers.iosListener.postMessage(JSON.stringify(message));
  } else {
    const { priceUrl } = getState().session;

    services.navigationService.assign(decodeURIComponent(priceUrl));
  }
};

export const initMicSettings = () => ({
  type: types.INIT_MIC_SETTINGS,
  payload: { isMicEnabled: null }
});

export const setMicSettings = (isMicEnabled) => ({
  type: types.SET_MIC_SETTINGS,
  payload: { isMicEnabled }
});

export const toggleTransliterationVisibility = () => ({
  type: types.TOGGLE_TRANSLITERATION_VISIBILITY
});
