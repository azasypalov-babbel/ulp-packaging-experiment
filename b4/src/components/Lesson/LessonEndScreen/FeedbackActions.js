import React from 'react';
import PropTypes from 'prop-types';
import cx from '../../../lib/cxHelper';
import * as features from '../../../lib/features';
import LoyButton from '../../Legacy/LoyButton';

const FeedbackActions = ({
  purgeableItemsCount,
  onCorrectErrorsButtonClick,
  onReturnHomeButtonClick,
  isUnlocked,
  onAccessContentButtonClick,
  accessLessonContentText,
  accessLessonContentButton,
  correctErrorsButton,
  returnHomeButton
}) => {
  const showCorrectErrors = purgeableItemsCount > 0 && !features.isWebview();

  const renderContentLocked = () => (
    <>
      <p>{accessLessonContentText}</p>
      <LoyButton
        primary
        listenToKey="Enter"
        data-selector="access-content-button"
        onClick={onAccessContentButtonClick}
      >
        {accessLessonContentButton}
      </LoyButton>
    </>
  );

  const renderContentUnlocked = () => (
    <>
      { showCorrectErrors && (
        <LoyButton
          primary
          data-selector="correct-errors-button"
          listenToKey="Enter"
          onClick={onCorrectErrorsButtonClick}>
          {correctErrorsButton}
        </LoyButton>
      )}
      <LoyButton
        primary={!showCorrectErrors}
        listenToKey={!showCorrectErrors ? 'Enter' : undefined}
        data-selector="return-home-button"
        onClick={onReturnHomeButtonClick}>
        {returnHomeButton}
      </LoyButton>
    </>
  );

  return (
    <div className={cx('lesson-end-screen-feedback-actions')}>
      { isUnlocked ?
        renderContentUnlocked() : renderContentLocked()
      }
    </div>
  );
};

FeedbackActions.propTypes = {
  purgeableItemsCount: PropTypes.number,
  onCorrectErrorsButtonClick: PropTypes.func,
  onReturnHomeButtonClick: PropTypes.func,
  isUnlocked: PropTypes.bool.isRequired,
  onAccessContentButtonClick: PropTypes.func,
  accessLessonContentText: PropTypes.string.isRequired,
  accessLessonContentButton: PropTypes.string.isRequired,
  correctErrorsButton: PropTypes.string.isRequired,
  returnHomeButton: PropTypes.string.isRequired
};

export default FeedbackActions;
