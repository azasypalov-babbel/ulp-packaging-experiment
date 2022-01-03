import React from 'react';
import PropTypes from 'prop-types';
import cx from '../../../lib/cxHelper';
import * as features from '../../../lib/features';

import Card from './Card';
import ReviewActions from './ReviewActions';
import { localeToBCP47 } from '../../../lib/languageCodeConverter';
import CenterContent from '../../shared/CenterContent';
import withTranslations from '../../shared/withTranslations';

export const ReviewEndScreen = ({
  correctItems,
  incorrectItems,
  purgeableItemsCount,
  onCorrectErrorsButtonClick,
  onReviewMoreButtonClick,
  locale,
  playSound,
  onCloseButtonClick,
  hasNextReviewItems,
  playEndScreenSound,
  translations
}) => {
  const localeConverted = localeToBCP47(locale);
  const getMoreInfoUrl = `https://support.babbel.com/hc/${localeConverted}/articles/205600228`;

  const actionsProps = {
    purgeableItemsCount,
    onCorrectErrorsButtonClick,
    hasNextReviewItems,
    onCloseButtonClick,
    onReviewMoreButtonClick,
    correctErrorsButtonText: translations.correctErrorsButton,
    closeText: translations.close,
    reviewMoreButtonText: translations.reviewMoreButton
  };

  return (
    <CenterContent>
      <div className="loy">
        <div className={cx('review-end-screen')}>
          <h1 data-feedback-grade={translations.grade}>{translations.title}</h1>
          <p>{translations.subtitle}</p>
          <div className={cx('review-end-screen__cards')}>
            { incorrectItems.length > 0 && (
              <Card
                type="incorrect"
                title={translations.incorrect}
                onItemClick={playSound}
                itemsList={incorrectItems} />
            )
            }
            { correctItems.length > 0 && (
              <Card
                title={translations.correct}
                onItemClick={playSound}
                type="correct"
                onAnimationComplete={playEndScreenSound}
                itemsList={correctItems}/>
            )
            }
          </div>
          <div className={cx('review-end-screen__actions')}>
            <ReviewActions {...actionsProps} />
          </div>
          {
            !features.isWebview() && (
              <p>
                <a
                  className={cx('link link--primary')}
                  target="_blank"
                  rel="noopener noreferrer"
                  href={getMoreInfoUrl}
                >
                  {translations.moreInfoLink}
                </a>
              </p>
            )
          }
        </div>
      </div>
    </CenterContent>
  );
};

ReviewEndScreen.propTypes = {
  correctItems: PropTypes.arrayOf(PropTypes.shape({
    learnLanguageText: PropTypes.string.isRequired,
    sound: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  })),
  incorrectItems: PropTypes.arrayOf(PropTypes.shape({
    learnLanguageText: PropTypes.string.isRequired,
    sound: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  })),
  purgeableItemsCount: PropTypes.number.isRequired,
  onCorrectErrorsButtonClick: PropTypes.func.isRequired,
  onReviewMoreButtonClick: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  playSound: PropTypes.func.isRequired,
  playEndScreenSound: PropTypes.func.isRequired,
  onCloseButtonClick: PropTypes.func.isRequired,
  hasNextReviewItems: PropTypes.bool.isRequired,
  translations: PropTypes.shape({
    correctErrorsButton: PropTypes.string.isRequired,
    close: PropTypes.string.isRequired,
    reviewMoreButton: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    moreInfoLink: PropTypes.string.isRequired,
    grade: PropTypes.string.isRequired,
    correct: PropTypes.string.isRequired,
    incorrect: PropTypes.string.isRequired
  }).isRequired,
  grade: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  totalItemsCount: PropTypes.number.isRequired
};

const getTranslations = (translate, props) => ({
  correctErrorsButton: translate('review_end_screen.purge_errors', { mistakes: props.purgeableItemsCount }),
  close: translate('review_end_screen.close'),
  reviewMoreButton: translate('review_end_screen.review_more'),
  title: translate(`review_end_screen.feedback_message.${props.grade}`, { name: props.displayName }),
  subtitle: translate('review_end_screen.subtitle_pluralized', { count: props.totalItemsCount }),
  moreInfoLink: translate('review_end_screen.more_info_link'),
  grade: props.grade,
  incorrect: translate('review_end_screen.incorrect'),
  correct: translate('review_end_screen.correct')
});

export default withTranslations(getTranslations)(ReviewEndScreen);
