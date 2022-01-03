import React from 'react';
import PropTypes from 'prop-types';
import * as features from '../../../lib/features';
import LoyButton from '../../Legacy/LoyButton';

const ReviewActions = (props) => {
  const {
    purgeableItemsCount,
    onCorrectErrorsButtonClick,
    hasNextReviewItems,
    onCloseButtonClick,
    onReviewMoreButtonClick,
    correctErrorsButtonText,
    closeText,
    reviewMoreButtonText
  } = props;

  const showCorrectErrors = purgeableItemsCount > 0 && !features.isWebview();
  const showReviewMore = hasNextReviewItems && !features.isWebview();

  return (
    <div>
      {showCorrectErrors && <LoyButton
        data-selector="correct-errors-button"
        onClick={onCorrectErrorsButtonClick}
      >
        {correctErrorsButtonText}
      </LoyButton>}
      {showReviewMore
        ? <LoyButton
          primary
          listenToKey="Enter"
          data-selector="review-more-button"
          onClick={onReviewMoreButtonClick}
        >
          {reviewMoreButtonText}
        </LoyButton>
        : <LoyButton
          primary
          listenToKey="Enter"
          data-selector="close-button"
          onClick={onCloseButtonClick}
        >
          {closeText}
        </LoyButton>
      }
    </div>
  );
};

ReviewActions.propTypes = {
  purgeableItemsCount: PropTypes.number.isRequired,
  onCorrectErrorsButtonClick: PropTypes.func.isRequired,
  onReviewMoreButtonClick: PropTypes.func.isRequired,
  onCloseButtonClick: PropTypes.func.isRequired,
  hasNextReviewItems: PropTypes.bool.isRequired,
  correctErrorsButtonText: PropTypes.string.isRequired,
  closeText: PropTypes.string.isRequired,
  reviewMoreButtonText: PropTypes.string.isRequired
};

export default ReviewActions;
