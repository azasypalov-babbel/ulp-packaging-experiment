import * as types from './types';
import * as sequenceActions from '../sequence/actions';
import * as sequenceTypes from '../sequence/types';
import { filterInteractionTypes } from './helpers';
import * as reviewActions from './actions';
import { isReview } from '../session/selectors';
import {
  mapTrainerTypeInteraction,
  logIncorrectItemsToRollbar
} from '../../lib/trainerItemsStrategy';
import services from '../../services';

const review = (store) => (next) => (action) => {
  const enhancedAction = { ...action };
  let result;

  const { session } = store.getState();

  if (!isReview(session)) {
    return next(enhancedAction);
  }

  if (action.type === `${types.FETCH_INTERACTION_TYPES}_FULFILLED`) {
    const interactions = action.payload;
    if (interactions.length === 0) {
      services.navigationService.assign(`${session.myBaseUrl}/review-manager`);

      return;
    }
    enhancedAction.payload = filterInteractionTypes(interactions);
  }

  if (action.type === `${types.FETCH_NEXT_REVIEW_ITEMS}_FULFILLED`) {
    const trainers = mapTrainerTypeInteraction(action.payload.review_session.trainers);

    /* eslint-disable camelcase */
    const data = {
      content_uuid: store.getState().session.type,
      learn_language_alpha3: store.getState().session.learnLanguageAlpha3,
      locale: store.getState().session.locale
    };
    /* eslint-enable camelcase */
    logIncorrectItemsToRollbar(trainers, data);

    if (trainers.length === 0) {
      services.navigationService.assign(`${session.myBaseUrl}/review-manager`);

      return;
    }

    store.dispatch(sequenceActions.init(trainers));
    store.dispatch(sequenceActions.startSequence());
  }

  result = next(enhancedAction);

  if (action.type === types.UPDATE_INTERACTION && action.payload !== null) {
    store.dispatch(reviewActions.fetchNextReviewItems());
  }

  if (action.type === sequenceTypes.ATTEMPT_ITEM) {
    const { item, attempt } = action.payload;
    store.dispatch(reviewActions.attemptItem(item, attempt));
  }

  if (action.type === sequenceTypes.COMPLETE_ITEM) {
    store.dispatch(reviewActions.completeItem(action.payload));
  }

  if (action.type === sequenceTypes.COMPLETE_SEQUENCE) {
    store.dispatch(reviewActions.completeReview());
  }

  if (action.type === sequenceTypes.PREPARE_PURGE) {
    store.dispatch(reviewActions.preparePurge());
  }

  return result;
};

export default review;
