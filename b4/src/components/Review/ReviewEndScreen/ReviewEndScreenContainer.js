import { connect } from 'react-redux';
import { compose } from 'redux';
import ReviewEndScreen from './ReviewEndScreen';
import { withServices } from '../../shared/withServices';
import * as accountSelectors from '../../../dux/account/selectors';
import * as sequenceSelectors from '../../../dux/sequence/selectors';
import * as reviewActions from '../../../dux/review/actions';
import * as sequenceActions from '../../../dux/sequence/actions';
import { formatLL } from '../../../lib/markupFormatter';
import playFeedbackSound, { FEEDBACK_SOUND } from '../../../lib/playFeedbackSound';


export const getGrade = (correctItemsCount, totalItemsCount) => {
  const percentage = (correctItemsCount * 100) / totalItemsCount;
  if (percentage > 66) return 'high';
  if (percentage > 33) return 'medium';

  return 'low';
};

const playSound = (soundService, mediaUrlService) => (item) => {
  if (item.sound && item.sound.id) {
    const url = mediaUrlService.soundURL(item.sound.id);
    soundService.play(url);
  }
};

const formatLearnLanguageText = (item) => ({
  ...item,
  learnLanguageText: formatLL(item.learnLanguageText)
});

export const mapStateToProps = ({ account, review, session, sequence }) => ({
  displayName: accountSelectors.displayName(account),
  hasNextReviewItems: review.hasNextReviewItems,
  locale: session.locale,
  purgeableItemsCount: sequenceSelectors.purgeableItems(sequence).length,
  correctItems: sequenceSelectors.correctItems(sequence).map(formatLearnLanguageText),
  incorrectItems: sequenceSelectors.incorrectItems(sequence).map(formatLearnLanguageText)
});

const mapDispatchToProps = {
  onCorrectErrorsButtonClick: sequenceActions.startPurge,
  onReviewMoreButtonClick: reviewActions.fetchNextReviewItems,
  onCloseButtonClick: reviewActions.closeReview
};

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { soundService, mediaUrlService } = ownProps;
  const { correctItems, incorrectItems } = stateProps;

  const totalItemsCount = correctItems.length + incorrectItems.length;
  const correctItemsCount = correctItems.length;
  const grade = getGrade(correctItemsCount, totalItemsCount);

  const playEndScreenSound = () => playFeedbackSound(FEEDBACK_SOUND.END);

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    playSound: playSound(soundService, mediaUrlService),
    playEndScreenSound,
    grade,
    totalItemsCount
  };
};

export default compose(
  withServices(['soundService', 'mediaUrlService']),
  connect(mapStateToProps, mapDispatchToProps, mergeProps)
)(ReviewEndScreen);
