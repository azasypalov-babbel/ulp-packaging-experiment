import * as types from './types';
import sanitizeReturnUrl from '../../lib/sanitizeReturnUrl';

const initialState = {
  type: null,
  locale: null,
  learnLanguageAlpha3: null,
  learningTipConfirmed: false,
  returnUrl: null,
  priceUrl: null,
  client: null,
  myBaseUrl: null,
  lessonLandingScreenSettings: {
    shouldShow: false
  },
  micSettings: {
    isMicEnabled: null
  },
  transliterationSettings: {
    shouldShow: true
  },
  isUnsupportedBrowserWarningDismissed: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.INIT_SESSION: {
      const {
        type,
        locale,
        learnLanguageAlpha3,
        returnUrl,
        priceUrl,
        client,
        myBaseUrl,
        showLessonLandingScreen
      } = action.payload;

      return {
        ...state,
        type,
        locale,
        learnLanguageAlpha3,
        returnUrl: sanitizeReturnUrl(returnUrl),
        priceUrl,
        client,
        myBaseUrl,
        lessonLandingScreenSettings: {
          shouldShow: Boolean(showLessonLandingScreen)
        }
      };
    }

    case types.CONFIRM_LEARNING_TIP: {
      return {
        ...state,
        learningTipConfirmed: true
      };
    }

    case types.CONFIRM_LESSON_LANDING_SCREEN: {
      return {
        ...state,
        lessonLandingScreenSettings: {
          ...state.lessonLandingScreenSettings,
          shouldShow: false
        }
      };
    }

    case types.DISMISS_UNSUPPORTED_BROWSER_WARNING: {
      return {
        ...state,
        isUnsupportedBrowserWarningDismissed: true
      };
    }

    case types.INIT_MIC_SETTINGS: {
      const { isMicEnabled } = action.payload;

      return {
        ...state,
        micSettings: {
          isMicEnabled
        }
      };
    }

    case types.SET_MIC_SETTINGS: {
      const { isMicEnabled } = action.payload;

      return {
        ...state,
        micSettings: {
          isMicEnabled
        }
      };
    }

    case types.TOGGLE_TRANSLITERATION_VISIBILITY: {
      return {
        ...state,
        transliterationSettings: {
          shouldShow: !state.transliterationSettings.shouldShow
        }
      };
    }

    default: {
      return state;
    }
  }
}
