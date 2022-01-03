import { track } from './actions';
import * as vocabularyReviewEvents from './events/vocabularyReview';
import * as sequenceTypes from '../sequence/types';
import * as reviewTypes from '../review/types';
import { isWebview } from '../../lib/features';

const middleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();

  if (action.type === sequenceTypes.INIT) {
    const { reviewLoopsCounter } = state.review;

    if (reviewLoopsCounter > 0) {
      store.dispatch(track(vocabularyReviewEvents.vocabReviewStartedContinueEvent(state)));
    }
  }

  if (action.type === sequenceTypes.ABORT_SEQUENCE) {
    const event = vocabularyReviewEvents.vocabReviewEndedAbortEvent(state);
    store.dispatch(track(event));
  }

  if (action.type === reviewTypes.UPDATE_INTERACTION && !isWebview()) {
    const event = vocabularyReviewEvents.vocabReviewTypeChosenEvent(state);

    store.dispatch(track(event));
  }


  return result;
};

export default middleware;
