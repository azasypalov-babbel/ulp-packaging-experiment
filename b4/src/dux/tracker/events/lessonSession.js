import { trainerPropertiesPayload } from './trainer';
import * as sequenceSelectors from '../../sequence/selectors';
import * as contentSelectors from '../../content/selectors';
import * as contentReleaseSelectors from '../../contentRelease/selectors';

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
    session_points_total: -1,
    session_loop: state.sequence.purgeLoopsCounter
  };
  /* eslint-enable camelcase */
};

export const lessonSessionEventPayload = (state) => {
  const { content, lesson: { lessonUuid, learningActivityId }, sequence } = state;
  const course = contentSelectors.currentCourse(content, learningActivityId);

  const totalItems = sequenceSelectors.items(sequence).length;

  /* eslint-disable camelcase */
  return {
    ...genericTrainersEventPayload(state),
    lesson_uuid: learningActivityId,
    content_uuid: lessonUuid,
    course_uuid: course ? course.id : null,
    session_items_total: totalItems
  };
  /* eslint-enable camelcase */
};


export const lessonSessionEndedEventPayload = (state) => {
  const trainerProgress =  sequenceSelectors.sequenceProgressCounter(state.sequence);

  /* eslint-disable camelcase */
  return {
    ...lessonSessionEventPayload(state),
    number_of_pages_in_lesson: trainerProgress.total,
    position_in_lesson: trainerProgress.current
  };
  /* eslint-enable camelcase */
};

export const lessonSessionTrainerEventPayload = (state) => {
  const trainerProgress =  sequenceSelectors.sequenceProgressCounter(state.sequence);
  const contentReleaseId = contentReleaseSelectors.contentReleaseId(state.contentRelease);

  /* eslint-disable camelcase */
  return {
    ...lessonSessionEventPayload(state),
    ...trainerPropertiesPayload(state),
    position_in_lesson: trainerProgress.current,
    content_release_id: contentReleaseId
  };
  /* eslint-enable camelcase */
};

export const lessonSessionStartedInitialEvent = (state) => ({
  event: 'lesson_session:started:initial',
  version: 5,
  payload: lessonSessionEventPayload(state)
});

export const lessonSessionStartedPurgeEvent = (state) => ({
  event: 'lesson_session:started:purge',
  version: 5,
  payload: lessonSessionEventPayload(state)
});

export const lessonSessionEndedFinishEvent = (state) => ({
  event: 'lesson_session:ended:finish',
  version: 5,
  payload: lessonSessionEndedEventPayload(state)
});

export const lessonSessionEndedAbortEvent = (state) => ({
  event: 'lesson_session:ended:abort',
  version: 5,
  payload: lessonSessionEndedEventPayload(state)
});

export const lessonSessionTrainerStartedEvent = (state) => ({
  event: 'lesson_session:trainer:started',
  version: 9,
  payload: lessonSessionTrainerEventPayload(state)
});

export const lessonSessionTrainerFinishedEvent = (state) => ({
  event: 'lesson_session:trainer:finished',
  version: 9,
  payload: lessonSessionTrainerEventPayload(state)
});
