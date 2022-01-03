import { track } from './actions';
import * as lessonSessionEvents from './events/lessonSession';
import * as lessonEvents from './events/lesson';
import * as contentSelectors from '../content/selectors';
import * as sequenceTypes from '../sequence/types';
import * as features from '../../lib/features';
import rollbar from '../../services/rollbarService';

const middleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();

  if (action.type === sequenceTypes.START_TRAINER) {
    const event = lessonSessionEvents.lessonSessionTrainerStartedEvent(state);
    store.dispatch(track(event));
  }

  if (action.type === sequenceTypes.COMPLETE_TRAINER) {
    const event = lessonSessionEvents.lessonSessionTrainerFinishedEvent(state);
    store.dispatch(track(event));
  }

  if (action.type === sequenceTypes.COMPLETE_SEQUENCE) {
    const event = lessonSessionEvents.lessonSessionEndedFinishEvent(state);
    store.dispatch(track(event));
  }

  if (action.type === sequenceTypes.ABORT_SEQUENCE) {
    const event = lessonSessionEvents.lessonSessionEndedAbortEvent(state);
    store.dispatch(track(event));
  }

  if (action.type === sequenceTypes.INIT) {
    const currentLesson = contentSelectors.currentLesson(
      state.content,
      state.lesson.learningActivityId
    );

    if (!currentLesson) {
      rollbar.error(
        'Unable to track lesson start, lesson is not available in user content'
      );
    } else {
      if (!features.isWebview()) {
        if (currentLesson.completed) {
          store.dispatch(track(lessonEvents.lessonRestartedEvent(state)));
        } else {
          store.dispatch(track(lessonEvents.lessonStartedEvent(state)));
        }
      }

      store.dispatch(
        track(lessonSessionEvents.lessonSessionStartedInitialEvent(state))
      );
    }
  }

  if (action.type === sequenceTypes.ATTEMPT_ITEM) {
    const { item, attempt, trainerData } = action.payload;
    const event = lessonEvents.lessonTrainerItemAttemptedEvent(state);
    const extendedEvent = {
      ...event,
        /* eslint-disable camelcase */
      payload: {
        ...event.payload,
        item_position_in_trainer: trainerData?.item_position_in_trainer,
        number_of_items_in_trainer: trainerData?.item_position_in_trainer,
        trainer_item_uuid: item.id,
        trainer_item_type: item.type,
        vocabulary_name: item.learn_language_text,
        vocabulary_translation: item.display_language_text,
        attempt_number: attempt.number,
        attempt_result: attempt.solved ? 'solved' : 'unsolved',
        attempt_text: attempt.text,
        target_text: attempt.targetText
      }
        /* eslint-enable camelcase */
    };

    store.dispatch(track(extendedEvent));
  }

  if (action.type === sequenceTypes.SKIP_ITEM) {
    const { item, attempt, trainerData } = action.payload;
    const event = lessonEvents.lessonTrainerItemSkippedEvent(state);
    const extendedEvent = {
      ...event,
        /* eslint-disable camelcase */
      payload: {
        ...event.payload,
        item_position_in_trainer: trainerData?.item_position_in_trainer,
        number_of_items_in_trainer: trainerData?.item_position_in_trainer,
        trainer_item_uuid: item.id,
        trainer_item_type: item.type,
        vocabulary_name: item.learn_language_text,
        vocabulary_translation: item.display_language_text,
        attempt_number: attempt.number,
        attempt_text: null,
        target_text: attempt.targetText,
        engine_name: attempt.engineName
      }
        /* eslint-enable camelcase */
    };

    store.dispatch(track(extendedEvent));
  }

  return result;
};

export default middleware;
