import React from 'react';
import PropTypes from 'prop-types';
import cx from '../../../lib/cxHelper';
import * as features from '../../../lib/features';

import FeedbackMessage from './FeedbackMessage';
import AnswersCounter from './AnswersCounter';
import FeedbackActions from './FeedbackActions';
import CenterContent from '../../shared/CenterContent';
import ReferAFriendModalContainer from '../../ReferAFriend/ReferAFriendModalContainer';

const LessonEndScreen = ({
  displayName,
  correctItemsCount,
  incorrectItemsCount,
  purgeableItemsCount,
  onCorrectErrorsButtonClick,
  onReturnHomeButtonClick,
  learnLanguageAlpha3,
  isUnlocked,
  onAccessContentButtonClick,
  playEndScreenSound,
  translations,
  grade,
  showReferAFriend,
  locale
}) => {
  const totalItemsCount = correctItemsCount + incorrectItemsCount;

  return (
    <>
      { showReferAFriend ? <ReferAFriendModalContainer locale={locale} /> : '' }
      <CenterContent>
        <div className="loy">
          <div data-selector="lesson-end-screen-container" className={cx('lesson-end-screen',
            features.isWebview() && 'lesson-end-screen__disable-selection')}>
            <div className={cx('lesson-end-screen__content')}>
              <FeedbackMessage
                displayName={displayName}
                grade={grade}
                learnLanguageAlpha3={learnLanguageAlpha3}
                feedbackMessageText={translations.feedbackMessageText} />
              <AnswersCounter
                onCounterEnd={playEndScreenSound}
                correctItemsCount={correctItemsCount}
                totalItemsCount={totalItemsCount}
                correctAnswersText={translations.correctAnswersText} />
              <FeedbackActions
                purgeableItemsCount={purgeableItemsCount}
                onCorrectErrorsButtonClick={onCorrectErrorsButtonClick}
                onReturnHomeButtonClick={onReturnHomeButtonClick}
                isUnlocked={isUnlocked}
                onAccessContentButtonClick={onAccessContentButtonClick}
                accessLessonContentText={translations.accessLessonContentText}
                accessLessonContentButton={translations.accessLessonContentButton}
                correctErrorsButton={translations.correctErrorsButton}
                returnHomeButton={translations.returnHomeButton} />
            </div>
          </div>
        </div>
      </CenterContent>
    </>
  );
};

LessonEndScreen.propTypes = {
  displayName: PropTypes.string.isRequired,
  correctItemsCount: PropTypes.number.isRequired,
  incorrectItemsCount: PropTypes.number.isRequired,
  purgeableItemsCount: PropTypes.number.isRequired,
  onCorrectErrorsButtonClick: PropTypes.func,
  onReturnHomeButtonClick: PropTypes.func,
  learnLanguageAlpha3: PropTypes.string.isRequired,
  isUnlocked: PropTypes.bool.isRequired,
  onAccessContentButtonClick: PropTypes.func,
  playEndScreenSound: PropTypes.func.isRequired,
  translations: PropTypes.shape({
    accessLessonContentText: PropTypes.string.isRequired,
    accessLessonContentButton: PropTypes.string.isRequired,
    correctErrorsButton: PropTypes.string.isRequired,
    returnHomeButton: PropTypes.string.isRequired,
    correctAnswersText: PropTypes.string.isRequired,
    feedbackMessageText: PropTypes.string.isRequired
  }).isRequired,
  grade: PropTypes.string.isRequired,
  showReferAFriend: PropTypes.bool.isRequired,
  locale: PropTypes.string.isRequired
};

export default LessonEndScreen;
