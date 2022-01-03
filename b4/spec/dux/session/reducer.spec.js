import reducer from '../../../src/dux/session/reducer';
import {
  initSession,
  confirmLearningTip,
  dismissUnsupportedBrowserWarning,
  initMicSettings,
  setMicSettings,
  toggleTransliterationVisibility
} from '../../../src/dux/session/actions';

describe('session reducer', () => {
  test('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual({
      type: null,
      locale: null,
      learnLanguageAlpha3: null,
      learningTipConfirmed: false,
      returnUrl: null,
      priceUrl: null,
      client: null,
      myBaseUrl: null,
      micSettings: {
        isMicEnabled: null
      },
      lessonLandingScreenSettings: {
        shouldShow: false
      },
      transliterationSettings: {
        shouldShow: true
      },
      isUnsupportedBrowserWarningDismissed: false
    });
  });

  test('should handle INIT_SESSION', () => {
    const state = {
      type: null,
      locale: null,
      learnLanguageAlpha3: null,
      learningTipConfirmed: false,
      returnUrl: null,
      client: null
    };
    const action = initSession({
      type: 'LESSON',
      locale: 'en',
      learnLanguageAlpha3: 'DEU',
      returnUrl: 'http://home.babbel.com',
      client: {
        browserName: 'Chrome'
      }
    });

    expect(
      reducer(state, action)
    ).toMatchObject({
      type: 'LESSON',
      locale: 'en',
      learnLanguageAlpha3: 'DEU',
      returnUrl: 'http://home.babbel.com',
      client: {
        browserName: 'Chrome'
      }
    });
  });

  test('should handle LEARNING_TIP_CONFIRMED', () => {
    const state = {
      learningTipConfirmed: false
    };
    const action = confirmLearningTip();
    expect(
      reducer(state, action)
    ).toMatchObject({
      learningTipConfirmed: true
    });
  });

  test('should handle INIT_MIC_SETTINGS', () => {
    const state = {
      micSettings: {
        isMicEnabled: false
      }
    };
    const action = initMicSettings();

    expect(
      reducer(state, action)
    ).toMatchObject({
      micSettings: {
        isMicEnabled: null
      }
    });
  });

  test('should handle SET_MIC_SETTINGS', () => {
    const state = {
      micSettings: {
        isMicEnabled: false
      }
    };
    const action = setMicSettings(true);

    expect(
      reducer(state, action)
    ).toMatchObject({
      micSettings: {
        isMicEnabled: true
      }
    });
  });

  test('should handle DISMISS_UNSUPPORTED_BROWSER_WARNING', () => {
    const state = {
      isUnsupportedBrowserWarningDismissed: false
    };
    const action = dismissUnsupportedBrowserWarning();
    expect(
      reducer(state, action)
    ).toMatchObject({
      isUnsupportedBrowserWarningDismissed: true
    });
  });

  test('should handle TOGGLE_TRANSLITERATION_VISIBILITY', () => {
    const state = {
      transliterationSettings: {
        shouldShow: false
      }
    };
    const action = toggleTransliterationVisibility();
    expect(
      reducer(state, action)
    ).toMatchObject({
      transliterationSettings: {
        shouldShow: true
      }
    });
  });
});
