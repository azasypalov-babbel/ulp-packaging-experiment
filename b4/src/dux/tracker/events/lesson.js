import * as contentSelectors from '../../content/selectors';
import * as contentReleaseSelectors from '../../contentRelease/selectors';
import { trainerPropertiesPayload } from './trainer';

export const lessonEventPayload = (state) => {
  const { locale, learnLanguageAlpha3 } = state.session;
  const { lessonUuid, learningActivityId } = state.lesson;

  /* eslint-disable camelcase */
  return {
    locale: locale,
    learn_language_alpha3: learnLanguageAlpha3,
    lesson_uuid: learningActivityId,
    content_uuid: lessonUuid
  };
  /* eslint-enable camelcase */
};

// lesson:trainer_item:*
export const lessonTrainerItemEventPayload = (state) => {
  const currentTrainerIndex = state.sequence.currentTrainerIndex;
  const numberOfTrainers = state.sequence.trainers.length;

  // payload will be completed within the sequence.attemptItem action with the attempt data coming from the pages
  /* eslint-disable camelcase */
  return {
    ...lessonEventPayload(state),
    ...trainerPropertiesPayload(state),
    trainer_position_in_lesson: currentTrainerIndex + 1,
    number_of_trainers_in_lesson: numberOfTrainers,
    // event payload
    attempt_number: null,
    attempt_result: null,
    item_position_in_trainer: null,
    number_of_items_in_trainer: null,
    trainer_item_uuid: null,
    trainer_item_type: null,
    vocabulary_name: null,
    vocabulary_translation: null
  };
  /* eslint-enable camelcase */
};

// lesson:trainer_item:attempted
export const lessonTrainerItemAttemptedEventPayload = (state) => {
  const contentReleaseId = contentReleaseSelectors.contentReleaseId(state.contentRelease);
  const sessionLoop = state.sequence.purgeLoopsCounter;

  /* eslint-disable camelcase */
  return {
    ...lessonTrainerItemEventPayload(state),
    // event payload
    attempt_text: null,
    target_text: null,
    content_release_id: contentReleaseId,
    session_loop: sessionLoop
  };
  /* eslint-enable camelcase */
};

// lesson:trainer_item:skipped
export const lessonTrainerItemSkippedEventPayload = (state) => {
  /* eslint-disable camelcase */
  return {
    ...lessonTrainerItemEventPayload(state),
    // event payload
    attempt_text: null,
    target_text: null,
    engine_name: null
  };
  /* eslint-enable camelcase */
};

export const lessonTrainerItemAttemptedEvent = (state) => ({
  event: 'lesson:trainer_item:attempted',
  version: 14,
  payload: lessonTrainerItemAttemptedEventPayload(state)
});

export const lessonTrainerItemSkippedEvent = (state) => ({
  event: 'lesson:trainer_item:skipped',
  version: 10,
  payload: lessonTrainerItemSkippedEventPayload(state)
});

// lesson:(started|restarted)
export const lessonStartedEventPayload = (state) => {
  const { content, lesson: { learningActivityId }, contentRelease } = state;
  const courseOverview = contentSelectors.currentCourseOverview(content, learningActivityId);
  const course = contentSelectors.currentCourse(content, learningActivityId);
  const contentReleaseId = contentReleaseSelectors.contentReleaseId(contentRelease);

  /* eslint-disable camelcase */
  return {
    ...lessonEventPayload(state),
    position_in_course: course.lessons.findIndex(({ id }) => id === learningActivityId),
    number_of_lessons_in_course: course.lessonsCount,
    course_title: course.title,
    course_uuid: course.id,
    course_overview_title: courseOverview.title,
    course_overview_uuid: courseOverview.id,
    content_release_id: contentReleaseId
  };
  /* eslint-enable camelcase */
};

export const lessonStartedEvent = (state) => ({
  event: 'lesson:started',
  version: 11,
  payload: lessonStartedEventPayload(state)
});

export const lessonRestartedEvent = (state) => ({
  event: 'lesson:restarted',
  version: 11,
  payload: lessonStartedEventPayload(state)
});
