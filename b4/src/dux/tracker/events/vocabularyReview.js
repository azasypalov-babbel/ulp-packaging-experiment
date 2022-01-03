import * as sequenceSelectors from '../../sequence/selectors';
import * as reviewSelectors from '../../review/selectors';
import * as statisticsSelectors from '../../statistics/selectors';

const genericTrainersEventPayload = (state) => {
  const { locale, learnLanguageAlpha3 } = state.session;
  const correctItems = sequenceSelectors.correctItems(state.sequence);
  const incorrectItems = sequenceSelectors.incorrectItems(state.sequence);

  /* eslint-disable camelcase */
  return {
    locale: locale,
    learn_language_alpha3: learnLanguageAlpha3,
    session_items_correct: correctItems.length,
    session_items_done: correctItems.length + incorrectItems.length,
    session_loop: state.sequence.purgeLoopsCounter
  };
  /* eslint-enable camelcase */
};

export const vocabReviewEventPayload = (state) => {
  const interaction = ({
    write: 'written',
    speak: 'spoken',
    flashcard: 'flashcard',
    listen: 'listen'
  })[state.review.selectedInteraction];

  /* eslint-disable camelcase */
  return {
    ...genericTrainersEventPayload(state),
    review_type: interaction,
    source: null,
    overall_items_total: statisticsSelectors.totalVocabularyCount(state.statistics),
    overall_points_total: null
  };
  /* eslint-enable camelcase */
};

// vocabulary_review:started:*
export const vocabReviewStartedEventPayload = (state) => {
  const reviewItemsCount = reviewSelectors.reviewItemsCount(state.review);
  const remainingItemCount = reviewSelectors.remainingItemCount(state.review);

  /* eslint-disable camelcase */
  return {
    ...vocabReviewEventPayload(state),
    session_items_due: reviewItemsCount,
    overall_items_due: remainingItemCount + reviewItemsCount
  };
  /* eslint-enable camelcase */
};

// vocabulary_review:ended:*
export const vocabReviewEndedEventPayload = vocabReviewStartedEventPayload;

// vocabulary_review:trainer_item:attempted
export const vocabReviewTrainerItemAttemptedEventPayload = (state) => {
  const trainerItemProgress = sequenceSelectors.itemProgressCounter(state.sequence);

  /* eslint-disable camelcase */
  return {
    ...vocabReviewEventPayload(state),
    item_position_in_trainer: trainerItemProgress.current + 1,
    purge_flow: state.sequence.purgeLoopsCounter > 1,

    attempt_result: null,
    attempt_text: null,
    target_text: null
  };
  /* eslint-enable camelcase */
};

export const vocabReviewTypeChosenEvent = (state) => ({
  event: 'vocabulary_review:type_chosen',
  version: 3,
  payload: vocabReviewEventPayload(state)
});

export const vocabReviewStartedPurgeEvent = (state) => ({
  event: 'vocabulary_review:started:purge',
  version: 3,
  payload: vocabReviewStartedEventPayload(state)
});

export const vocabReviewStartedContinueEvent = (state) => ({
  event: 'vocabulary_review:started:continue',
  version: 3,
  payload: vocabReviewStartedEventPayload(state)
});

export const vocabReviewEndedFinishEvent = (state) => ({
  event: 'vocabulary_review:ended:finish',
  version: 3,
  payload: vocabReviewEndedEventPayload(state)
});

export const vocabReviewEndedAbortEvent = (state) => ({
  event: 'vocabulary_review:ended:abort',
  version: 3,
  payload: vocabReviewEndedEventPayload(state)
});

export const vocabReviewTrainerItemAttemptedEvent = (state) => ({
  event: 'vocabulary_review:trainer_item:attempted',
  version: 7,
  payload: vocabReviewTrainerItemAttemptedEventPayload(state)
});
