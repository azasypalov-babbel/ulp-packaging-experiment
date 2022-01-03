import * as types from './types';
import services from '../../services';
import { getReviewQueryParams, countReviewItems } from './helpers';
import * as sessionActions from '../session/actions';
import * as vocabularyReviewEvents from '../tracker/events/vocabularyReview';
import { track } from '../tracker/actions';
import { navigateToReturnUrl } from '../session/actions';
import * as features from '../../lib/features';
import { abortSequence } from '../sequence/actions';

const REVIEW_DUE = 'REVIEW_DUE';
const REVIEW_SEARCH = 'REVIEW_SEARCH';

export const completeItem = ({ item, mistakes }) => (dispatch, getState) => {
  const { locale, learnLanguageAlpha3, type: sessionType } = getState().session;

  let payload = Promise.resolve();

  if (sessionType === REVIEW_DUE) {
    const { reviewService } = services;
    const vocabularyItem = {
      id: item.id,
      mistakes
    };
    const vocabularyItems = [vocabularyItem];

    payload = dispatch({
      type: types.UPDATE_VOCABULARY_ITEMS,
      payload: reviewService.updateVocabularyItems({ locale, learnLanguageAlpha3, vocabularyItems })
    });
  }

  return dispatch({
    type: types.COMPLETE_ITEM,
    payload
  });
};

export const fetchInteractionTypes = () => (dispatch, getState) => {
  const { reviewService } = services;
  const { locale, learnLanguageAlpha3, type: reviewType } = getState().session;
  const params = getReviewQueryParams(reviewType);

  return dispatch({
    type: types.FETCH_INTERACTION_TYPES,
    payload: reviewService.getReviewTypes({ locale, learnLanguageAlpha3, params })
  });
};

export const updateInteraction = (selectedInteraction) => (dispatch) => {
  dispatch({
    type: types.UPDATE_INTERACTION,
    payload: selectedInteraction
  });

  const isSpeak = selectedInteraction === 'speak';
  dispatch(sessionActions.setMicSettings(isSpeak));
};

export const fetchNextReviewItems = () => (dispatch, getState) => {
  const { reviewService } = services;
  const { locale, learnLanguageAlpha3, type: reviewType } = getState().session;
  const { selectedInteraction, reviewItems } = getState().review;
  const { offset } = reviewItems.nextParams;

  const params = {
    interaction_type: selectedInteraction,
    offset,
    ...getReviewQueryParams(reviewType)
  };

  if (reviewType === REVIEW_DUE) {
    delete params.offset;
  }

  return dispatch({
    type: types.FETCH_NEXT_REVIEW_ITEMS,
    payload: reviewService.getReviewItems({ locale, learnLanguageAlpha3, params })
  });
};

const setHasNextReviewItemsInDueReview = () => (dispatch, getState) => {
  const { locale, learnLanguageAlpha3, type: reviewType } = getState().session;
  const { selectedInteraction } = getState().review;
  const { reviewService } = services;

  const params = {
    interaction_type: selectedInteraction,
    ...getReviewQueryParams(reviewType)
  };

  return dispatch({
    type: types.SET_HAS_NEXT_REVIEW_ITEMS,
    payload: reviewService.getReviewItems({
      locale,
      learnLanguageAlpha3,
      params
    }).then((payload) => {
      // eslint-disable-next-line no-underscore-dangle
      const remainingItemCount = payload._meta.remaining_item_count;
      const reviewItemCount = countReviewItems(payload.review_session.trainers);
      const hasNextReviewItems = (remainingItemCount + reviewItemCount) > 0;

      return hasNextReviewItems;
    })
  });
};

const setHasNextReviewItemsInSearchReview = () => (dispatch, getState) => {
  const { reviewItems } = getState().review;

  return dispatch({
    type: types.SET_HAS_NEXT_REVIEW_ITEMS,
    payload: Promise.resolve(reviewItems.remainingItemCount > 0)
  });
};

export const setHasNextReviewItems = () => (dispatch, getState) => {
  if (getState().session.type === REVIEW_SEARCH) {
    return dispatch(setHasNextReviewItemsInSearchReview());
  }

  return dispatch(setHasNextReviewItemsInDueReview());
};

export const completeReview = () => (dispatch, getState) => {
  const event = vocabularyReviewEvents.vocabReviewEndedFinishEvent(getState());
  dispatch(track(event));

  // on native, completion is only processed once user closes the lesson player
  // via the Continue Learning or Close button
  if (features.isWebview()) {
    return Promise.resolve();
  }

  return dispatch({
    type: types.COMPLETE_REVIEW,
    payload: dispatch(setHasNextReviewItems())
  });
};

export const closeReview = () => async (dispatch, getState) => {
  const { sequence: { completed: isReviewCompleted } } = getState();

  if (features.isWebview()) {
    const { reviewService } = services;
    if (!isReviewCompleted) {
      dispatch(abortSequence());
      reviewService.postReviewAborted();
    } else {
      reviewService.postReviewCompleted();
    }
  } else {
    if (!isReviewCompleted) {
      // For web, abortSequence happens in unload handler in TrainersSequence;
    }
    dispatch(navigateToReturnUrl());
  }
};

export const preparePurge = () => (dispatch, getState) => {
  const event = vocabularyReviewEvents.vocabReviewStartedPurgeEvent(getState());

  return dispatch(track(event));
};

export const attemptItem = (item, attempt) => (dispatch, getState) => {
  const event = vocabularyReviewEvents.vocabReviewTrainerItemAttemptedEvent(getState());
  /* eslint-disable camelcase */
  const extendedEvent = {
    ...event,
    payload: {
      ...event.payload,
      attempt_result: attempt.solved ? 'solved' : 'unsolved',
      attempt_text: attempt.text,
      target_text: item.learn_language_text
    }
  };
  /* eslint-enable camelcase */

  return dispatch(track(extendedEvent));
};
