import { connect } from 'react-redux';
import { compose } from 'redux';
import languageNameInterpolations from '@lessonnine/pidgin.js/dist/interpolations.js';
import { learnLanguageAlpha3ToLocale } from '@lessonnine/pidgin.js/dist/helpers.js';
import LessonEndScreen from './LessonEndScreen';
import { isAllowedReferAFriend } from '../../../lib/smartSurfaces';
import * as accountSelectors from '../../../dux/account/selectors';
import * as sequenceSelectors from '../../../dux/sequence/selectors';
import * as contentSelectors from '../../../dux/content/selectors';
import * as statisticsSelectors from '../../../dux/statistics/selectors';
import * as profileSelectors from '../../../dux/profile/selectors';
import * as subscriptionsSelectors from '../../../dux/subscriptions/selectors';
import * as sessionActions from '../../../dux/session/actions';
import * as lessonActions from '../../../dux/lesson/actions';
import * as sequenceActions from '../../../dux/sequence/actions';
import * as trackerActions from '../../../dux/tracker/actions';

import rollbar from '../../../services/rollbarService';

import withTranslations from '../../shared/withTranslations';
import playFeedbackSound, { FEEDBACK_SOUND } from '../../../lib/playFeedbackSound';


const getGrade = (correctItemsCount, incorrectItemsCount) => {
  const totalItemsCount = correctItemsCount + incorrectItemsCount;
  const percentage = (correctItemsCount * 100) / totalItemsCount;
  if (percentage > 66) return 'high';
  if (percentage > 33) return 'medium';

  return 'low';
};

// In order to add variety to the UX of seeing the Refer-A-Friend feature, a random limiter is set.
// Otherwise, new users would always see the feature after completing their 2nd lesson.
const isStatisticallyRelevant = (subscriptionDateString) => {
  const subscriptionDate = new Date(subscriptionDateString);
  const featureLaunchDate = new Date('2020-10-21');

  return subscriptionDate < featureLaunchDate || Math.random() <= 0.4;
};

const getSubscriptionDate = (profile, account, subscriptions) => {
  if (profileSelectors.isB2bUser(profile)) {
    return accountSelectors.createdAt(account);
  } else {
    return subscriptionsSelectors.subscriptionDate(subscriptions);
  }
};

const getShowReferAFriend = (account, statistics, profile, subscriptions) => {
  try {
    const subscriptionDate = getSubscriptionDate(profile, account, subscriptions);

    return Boolean(
      isAllowedReferAFriend() &&
      statisticsSelectors.userHasCompletedLessons(statistics) &&
      subscriptionDate &&
      isStatisticallyRelevant(subscriptionDate)
    );
  } catch (error) {
    rollbar.warning(`SmartSurfacesError@LessonEndScreenContainer: ${error.message}`, {
      message: error.message,
      stack: error.stack
    });
  }

  return false;
};

export const mapStateToProps = ({ account, content, sequence, session, statistics, profile, subscriptions }) => ({
  displayName: accountSelectors.displayName(account),
  purgeableItemsCount: sequenceSelectors.purgeableItems(sequence).length,
  correctItemsCount: sequenceSelectors.correctItems(sequence).length,
  incorrectItemsCount: sequenceSelectors.incorrectItems(sequence).length,
  isUnlocked: contentSelectors.isUnlocked(content),
  locale: session.locale,
  learnLanguageAlpha3: session.learnLanguageAlpha3,
  showReferAFriend: getShowReferAFriend(account, statistics, profile, subscriptions)
});

const mapDispatchToProps = {
  navigateToPriceUrl: sessionActions.navigateToPriceUrl,
  track: trackerActions.track,
  closeLesson: lessonActions.closeLesson,
  onCorrectErrorsButtonClick: sequenceActions.startPurge
};

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const onCorrectErrorsButtonClick = ownProps.onCorrectErrorsButtonClick || dispatchProps.onCorrectErrorsButtonClick;

  const grade = getGrade(stateProps.correctItemsCount, stateProps.incorrectItemsCount);
  const onReturnHomeButtonClick = () => {
    /* eslint-disable camelcase */
    dispatchProps.track({
      event: 'gui:interacted',
      version: 1,
      payload: {
        gui_container: 'lesson_end_page',
        gui_element: 'close_button',
        interaction: 'clicked',
        origin: 'lesson_player',
        locale: stateProps.locale,
        learn_language_alpha3: stateProps.learnLanguageAlpha3
      }
    });
    /* eslint-enable camelcase */
    dispatchProps.closeLesson();
  };

  const playEndScreenSound = () => playFeedbackSound(FEEDBACK_SOUND.END);

  return {
    ...stateProps,
    grade,
    playEndScreenSound,
    onAccessContentButtonClick: dispatchProps.navigateToPriceUrl,
    onCorrectErrorsButtonClick,
    onReturnHomeButtonClick
  };
};

const getTranslations = (translate, props) => {
  const {
    purgeableItemsCount,
    correctItemsCount,
    incorrectItemsCount,
    locale,
    learnLanguageAlpha3
  } = props;

  const languageNames = languageNameInterpolations({ locale, learnLanguageAlpha3 });
  const grade = getGrade(correctItemsCount, incorrectItemsCount);
  const learnLanguageLocale = learnLanguageAlpha3ToLocale(learnLanguageAlpha3) || locale;

  return {
    accessLessonContentText: translate('page_end.content_locked.text_access_content', languageNames),
    accessLessonContentButton: translate('page_end.content_locked.button_access_content', languageNames),
    correctErrorsButton: translate('page_end.button_correct_errors', {
      purgable_items_count: purgeableItemsCount
    }),
    returnHomeButton: translate('page_end.button_return_home'),
    correctAnswersText: translate('page_end.correct_answers'),
    feedbackMessageText: translate(`page_end.feedback_message.${grade}`, { locale: learnLanguageLocale })
  };
};

const LessonEndScreenContainer = compose(
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
  withTranslations(getTranslations)
)(LessonEndScreen);

LessonEndScreenContainer.displayName = 'LessonEndScreenContainer';

export default LessonEndScreenContainer;
