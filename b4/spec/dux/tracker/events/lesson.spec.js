/* eslint-disable camelcase */
import {
  lessonEventPayload,
  lessonTrainerItemEventPayload,
  lessonTrainerItemAttemptedEventPayload,
  lessonTrainerItemSkippedEventPayload,
  lessonTrainerItemAttemptedEvent,
  lessonStartedEventPayload,
  lessonStartedEvent,
  lessonRestartedEvent
} from '../../../../src/dux/tracker/events/lesson';

import * as sessionSelectors from '../../../../src/dux/session/selectors';

jest.mock('../../../../src/dux/session/selectors', () => ({
  isReview: jest.fn().mockReturnValue(false),
  isLesson: jest.fn().mockReturnValue(true),
  isMicEnabled: jest.fn().mockReturnValue(true)
}));

jest.mock('../../../../src/dux/contentRelease/selectors', () => ({
  contentReleaseId: jest.fn().mockReturnValue('mocked-content-release-id')
}));

const trainers = [
  {
    type: 'card',
    interaction: 'choose',
    dictate: false,
    puzzle_helper: false,
    translation_visibility: 'full',
    item_groups: [
      {
        items: [
          {
            id: '1-skipped-item',
            learn_language_text: 'foo',
            attempt: {
              skipped: true
            }
          },
          {
            id: '2-mistaken-item',
            learn_language_text: 'foo',
            attempt: {
              mistakes: 2
            }
          },
          {
            id: '3-mistaken-item',
            learn_language_text: 'foo',
            attempt: {
              mistakes: 1
            }
          }
        ]
      },
      {
        items: [
          {
            id: '4-correct-item',
            learn_language_text: 'foo',
            attempt: {
              mistakes: 0
            }
          },
          {
            id: '5-unattempted-item',
            learn_language_text: 'foo',
            attempt: null
          }
        ]
      }
    ]
  }
];
const learningActivityCompletedId = 'c59ee920b4fe47ecb54a65a8d562b38a';
const learningActivityNotCompletedId = 'ffe7401e36ea4d4f88bfa47661e5db97';
const contentData = {
  data: {
    id: 'POR',
    name: 'Portuguese',
    unlocked: false,
    courseOverviews: [
      {
        id: 'b4aaa224fddb67950dd5e8a84ed3302e',
        title: 'course overview title',
        courses: [
          {
            id: '3c3a779d5cfe8d985becdffec0eea15b',
            title: 'Beginner I - Course 1',
            description: 'Talking about your age',
            unlocked: false,
            active: true,
            completed: false,
            lessonsCount: 2,
            completedLessonsCount: 0,
            tags: [
              'progressive',
              'A1'
            ],
            lessons: [
              {
                id: learningActivityCompletedId,
                completed: true
              },
              {
                id: learningActivityNotCompletedId,
                completed: false
              }
            ]
          }
        ]
      }
    ]
  }
};
const initialState = {
  session: {
    locale: 'en',
    learnLanguageAlpha3: 'DEU'
  },
  sequence: {
    purgeLoopsCounter: 1,
    currentTrainerIndex: 0,
    trainers
  },
  statistics: {
    data: {
      totalVocabularyCount: 4200
    }
  },
  lesson: {},
  review: {},
  contentRelease: {
    id: 'mocked-content-release-id'
  }
};

describe('lesson events', () => {
  const state = {
    ...initialState,
    lesson: {
      lessonUuid: 'mocked-lesson-uuid',
      learningActivityId: 'mocked-learning-activity-id'
    }
  };

  describe('lesson:*', () => {
    test('prepares the payload', () => {
      expect(lessonEventPayload(state)).toEqual({
        locale: 'en',
        learn_language_alpha3: 'DEU',
        lesson_uuid: 'mocked-learning-activity-id',
        content_uuid: 'mocked-lesson-uuid'
      });
    });
  });

  describe('lesson:(started|restarted)', () => {
    const state = {
      ...initialState,
      lesson: {
        lessonUuid: 'mocked-lesson-uuid',
        learningActivityId: learningActivityCompletedId
      },
      content: contentData
    };

    test('prepares the payload', () => {
      const { content: { data: contentData } } = state;
      const courseOverview = contentData.courseOverviews[0];
      const course = courseOverview.courses[0];

      expect(lessonStartedEventPayload(state)).toEqual({
        locale: 'en',
        learn_language_alpha3: 'DEU',
        lesson_uuid: learningActivityCompletedId,
        content_release_id: 'mocked-content-release-id',
        content_uuid: 'mocked-lesson-uuid',
        position_in_course: 0,
        number_of_lessons_in_course: course.lessonsCount,
        course_title: course.title,
        course_uuid: course.id,
        course_overview_title: courseOverview.title,
        course_overview_uuid: courseOverview.id
      });
    });

    describe('lesson:restarted', () => {
      test('renders expected event', () => {
        expect(lessonRestartedEvent(state)).toMatchSnapshot();
      });
    });

    describe('lesson:started', () => {
      test('renders expected event', () => {
        expect(lessonStartedEvent(state)).toMatchSnapshot();
      });
    });
  });

  describe('lesson:trainer_item:*', () => {
    test('prepares the payload', () => {
      expect(lessonTrainerItemEventPayload(state)).toEqual({
        locale: 'en',
        learn_language_alpha3: 'DEU',
        lesson_uuid: 'mocked-learning-activity-id',
        content_uuid: 'mocked-lesson-uuid',
        trainer_position_in_lesson: 1,
        number_of_trainers_in_lesson: 1,
        dictate: false,
        puzzle_helper: false,
        translation_visibility: 'full',
        trainer_type: 'card',
        trainer_shown: 'Card_Choicebuttons',
        interaction: 'choose',
        attempt_number: null,
        attempt_result: null,
        item_position_in_trainer: null,
        number_of_items_in_trainer: null,
        trainer_item_uuid: null,
        trainer_item_type: null,
        vocabulary_name: null,
        vocabulary_translation: null
      });
    });

    test('prepares the payload if there is no lesson context', () => {
      sessionSelectors.isReview.mockReturnValueOnce(false);
      sessionSelectors.isLesson.mockReturnValueOnce(false);

      expect(lessonTrainerItemEventPayload(state)).toEqual({
        locale: 'en',
        learn_language_alpha3: 'DEU',
        lesson_uuid: 'mocked-learning-activity-id',
        content_uuid: 'mocked-lesson-uuid',
        trainer_position_in_lesson: 1,
        number_of_trainers_in_lesson: 1,
        dictate: false,
        puzzle_helper: false,
        translation_visibility: 'full',
        trainer_type: 'card',
        trainer_shown: 'Card_Choicebuttons',
        interaction: 'choose',
        attempt_number: null,
        attempt_result: null,
        item_position_in_trainer: null,
        number_of_items_in_trainer: null,
        trainer_item_uuid: null,
        trainer_item_type: null,
        vocabulary_name: null,
        vocabulary_translation: null
      });
    });

    test('prepares the payload for attempted', () => {
      expect(lessonTrainerItemAttemptedEventPayload(state)).toEqual({
        locale: 'en',
        learn_language_alpha3: 'DEU',
        lesson_uuid: 'mocked-learning-activity-id',
        content_uuid: 'mocked-lesson-uuid',
        content_release_id: 'mocked-content-release-id',
        trainer_position_in_lesson: 1,
        number_of_trainers_in_lesson: 1,
        dictate: false,
        puzzle_helper: false,
        translation_visibility: 'full',
        trainer_type: 'card',
        trainer_shown: 'Card_Choicebuttons',
        interaction: 'choose',
        attempt_number: null,
        attempt_result: null,
        item_position_in_trainer: null,
        number_of_items_in_trainer: null,
        trainer_item_uuid: null,
        trainer_item_type: null,
        vocabulary_name: null,
        vocabulary_translation: null,
        attempt_text: null,
        target_text: null,
        session_loop: initialState.sequence.purgeLoopsCounter
      });
    });

    test('prepares the payload for skipped', () => {
      expect(lessonTrainerItemSkippedEventPayload(state)).toEqual({
        locale: 'en',
        learn_language_alpha3: 'DEU',
        lesson_uuid: 'mocked-learning-activity-id',
        content_uuid: 'mocked-lesson-uuid',
        engine_name: null,
        trainer_position_in_lesson: 1,
        number_of_trainers_in_lesson: 1,
        dictate: false,
        puzzle_helper: false,
        translation_visibility: 'full',
        trainer_type: 'card',
        trainer_shown: 'Card_Choicebuttons',
        interaction: 'choose',
        attempt_number: null,
        attempt_result: null,
        item_position_in_trainer: null,
        number_of_items_in_trainer: null,
        trainer_item_uuid: null,
        trainer_item_type: null,
        vocabulary_name: null,
        vocabulary_translation: null,
        attempt_text: null,
        target_text: null
      });
    });

    test('lesson:trainer_item:attempted', () => {
      expect(lessonTrainerItemAttemptedEvent(state)).toMatchSnapshot();
    });
  });
});
