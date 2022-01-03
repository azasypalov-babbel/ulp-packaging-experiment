import { createSelector } from 'reselect';

const REVIEW_SEARCH = 'REVIEW_SEARCH';
const REVIEW_DUE = 'REVIEW_DUE';
const LESSON = 'LESSON';

const sessionTypeSelector = (state) => state.type;

export const isReview = createSelector(
  sessionTypeSelector,
  (type) => type === REVIEW_SEARCH || type === REVIEW_DUE
);

export const isLesson = createSelector(
  sessionTypeSelector,
  (type) => type === LESSON
);

export const isChrome = createSelector(
  (state) => state.client,
  ({ browserName, userAgent }) => {
    if (browserName) return browserName === 'Chrome';
    if (userAgent) return userAgent.toLowerCase().indexOf('chrome') > -1;

    return false;
  }
);

export const isUnsupportedBrowser = createSelector(
  (state) => state.client,
  ({ browserName, browserVersion, userAgent }) => {
    if (browserName && browserVersion) return browserName === 'Internet Explorer' && browserVersion === '11.0';
    if (userAgent) return userAgent.toLowerCase().indexOf('trident/') > -1;

    return false;
  }
);

export const isMicEnabled = createSelector(
  (state) => state.micSettings,
  ({ isMicEnabled }) => isMicEnabled
);

export const isLessonLandingScreenShown = createSelector(
  (state) => state.lessonLandingScreenSettings,
  ({ shouldShow }) => shouldShow
);

export const isStaging = createSelector(
  (state) => state,
  ({ returnUrl }) => {
    const stagingRegex = RegExp(/(babbel\.cn|localhost)/);
    return stagingRegex.test(returnUrl);
  }
);
