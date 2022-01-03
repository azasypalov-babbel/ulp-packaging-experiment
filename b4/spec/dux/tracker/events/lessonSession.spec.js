/* eslint-disable camelcase */
import {
  lessonSessionEventPayload,
  lessonSessionEndedEventPayload,
  lessonSessionTrainerEventPayload,
  lessonSessionStartedInitialEvent,
  lessonSessionStartedPurgeEvent,
  lessonSessionEndedFinishEvent,
  lessonSessionEndedAbortEvent,
  lessonSessionTrainerStartedEvent,
  lessonSessionTrainerFinishedEvent
} from '../../../../src/dux/tracker/events/lessonSession';

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
    dictate: false,
    puzzle_helper: true,
    translation_visibility: 'full',
    interaction: 'write',
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

describe('tracker selectors', () => {
  describe('lesson session events', () => {
    const state = {
      ...initialState,
      lesson: {
        lessonUuid: 'mocked-lesson-uuid',
        learningActivityId: learningActivityCompletedId
      },
      content: contentData
    };

    describe('lesson_session:*', () => {
      test('prepares the default payload', () => {
        expect(
          lessonSessionEventPayload(state)
        ).toEqual({
          locale: 'en',
          learn_language_alpha3: 'DEU',
          session_items_correct: 1,
          session_items_done: 3,
          session_items_total: 5,
          session_points_total: -1,
          session_loop: 1,
          lesson_uuid: 'c59ee920b4fe47ecb54a65a8d562b38a',
          content_uuid: 'mocked-lesson-uuid',
          course_uuid: '3c3a779d5cfe8d985becdffec0eea15b'
        });
      });

      test('prepares the :ended events payload', () => {
        expect(
          lessonSessionEndedEventPayload(state)
        ).toEqual({
          locale: 'en',
          learn_language_alpha3: 'DEU',
          session_items_correct: 1,
          session_items_done: 3,
          session_items_total: 5,
          session_points_total: -1,
          session_loop: 1,
          lesson_uuid: 'c59ee920b4fe47ecb54a65a8d562b38a',
          content_uuid: 'mocked-lesson-uuid',
          course_uuid: '3c3a779d5cfe8d985becdffec0eea15b',
          number_of_pages_in_lesson: 1,
          position_in_lesson: 1
        });
      });

      describe('lesson_session:started:*', () => {
        test('lesson_session:started:initial', () => {
          expect(lessonSessionStartedInitialEvent(state)).toMatchSnapshot();
        });

        test('lesson_session:started:purge', () => {
          expect(lessonSessionStartedPurgeEvent(state)).toMatchSnapshot();
        });
      });

      describe('lesson_session:ended:*', () => {
        test('lesson_session:ended:finish', () => {
          expect(lessonSessionEndedFinishEvent(state)).toMatchSnapshot();
        });

        test('lesson_session:ended:abort', () => {
          expect(lessonSessionEndedAbortEvent(state)).toMatchSnapshot();
        });
      });

      describe('lesson_session:trainer:*', () => {
        test('prepares the trainer event payload', () => {
          expect(
            lessonSessionTrainerEventPayload(state)
          ).toEqual({
            locale: 'en',
            learn_language_alpha3: 'DEU',
            session_items_correct: 1,
            session_items_done: 3,
            session_items_total: 5,
            session_points_total: -1,
            session_loop: 1,
            lesson_uuid: 'c59ee920b4fe47ecb54a65a8d562b38a',
            content_uuid: 'mocked-lesson-uuid',
            course_uuid: '3c3a779d5cfe8d985becdffec0eea15b',
            position_in_lesson: 1,
            trainer_type: 'card',
            trainer_shown: 'Card_Puzzlehelper',
            translation_visibility: 'full',
            interaction: 'write',
            puzzle_helper: true,
            dictate: false,
            content_release_id: 'mocked-content-release-id'
          });
        });

        test('lesson_session:trainer:started', () => {
          expect(lessonSessionTrainerStartedEvent(state)).toMatchSnapshot();
        });

        test('lesson_session:trainer:finished', () => {
          expect(lessonSessionTrainerFinishedEvent(state)).toMatchSnapshot();
        });
      });
    });
  });
});
