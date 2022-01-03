/* eslint-disable camelcase */
import {
  vocabReviewEventPayload,
  vocabReviewStartedEventPayload,
  vocabReviewEndedEventPayload,
  vocabReviewTrainerItemAttemptedEventPayload,
  vocabReviewTypeChosenEvent,
  vocabReviewStartedContinueEvent,
  vocabReviewStartedPurgeEvent,
  vocabReviewEndedFinishEvent,
  vocabReviewEndedAbortEvent,
  vocabReviewTrainerItemAttemptedEvent
} from '../../../../src/dux/tracker/events/vocabularyReview';

jest.mock('../../../../src/dux/session/selectors', () => ({
  isReview: jest.fn().mockReturnValue(false)
}));

const trainers = [
  {
    type: 'memory',
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
  review: {}
};

describe('vocabulary review events', () => {
  describe('vocabulary_review:*', () => {
    const state = {
      ...initialState,
      review: {
        selectedInteraction: 'flashcard',
        reviewItems: {
          remainingItemCount: 42,
          reviewSession: {
            trainers
          }
        }
      }
    };

    test('prepares the payload', () => {
      expect(
        vocabReviewEventPayload(state)
      ).toEqual({
        locale: 'en',
        learn_language_alpha3: 'DEU',
        session_items_correct: 1,
        session_items_done: 3,
        session_loop: 1,
        review_type: 'flashcard',
        source: null,
        overall_items_total: 4200,
        overall_points_total: null
      });
    });

    test('vocabulary_review:type_chosen', () => {
      expect(vocabReviewTypeChosenEvent(state)).toMatchSnapshot();
    });

    describe('vocabulary_review:started:*', () => {
      test('prepares the payload', () => {
        expect(
          vocabReviewStartedEventPayload(state)
        ).toEqual({
          locale: 'en',
          learn_language_alpha3: 'DEU',
          session_items_correct: 1,
          session_items_done: 3,
          session_loop: 1,
          review_type: 'flashcard',
          session_items_due: 5,
          overall_items_due: 47,
          source: null,
          overall_items_total: 4200,
          overall_points_total: null
        });
      });

      test('vocabulary_review:started:purge', () => {
        expect(vocabReviewStartedPurgeEvent(state)).toMatchSnapshot();
      });

      test('vocabulary_review:started:continue', () => {
        expect(vocabReviewStartedContinueEvent(state)).toMatchSnapshot();
      });
    });

    describe('vocabulary_review:ended:*', () => {
      test('prepares the payload', () => {
        expect(
          vocabReviewEndedEventPayload(state)
        ).toEqual({
          locale: 'en',
          learn_language_alpha3: 'DEU',
          session_items_correct: 1,
          session_items_done: 3,
          session_loop: 1,
          review_type: 'flashcard',
          session_items_due: 5,
          overall_items_due: 47,
          source: null,
          overall_items_total: 4200,
          overall_points_total: null
        });
      });

      test('vocabulary_review:ended:finish', () => {
        expect(vocabReviewEndedFinishEvent(state)).toMatchSnapshot();
      });

      test('vocabulary_review:ended:abort', () => {
        expect(vocabReviewEndedAbortEvent(state)).toMatchSnapshot();
      });
    });

    describe('vocabulary_review:trainer_item:attempted', () => {
      test('prepares the payload', () => {
        expect(
          vocabReviewTrainerItemAttemptedEventPayload(state)
        ).toEqual({
          locale: 'en',
          learn_language_alpha3: 'DEU',
          session_items_correct: 1,
          session_items_done: 3,
          session_loop: 1,
          review_type: 'flashcard',
          source: null,
          overall_items_total: 4200,
          overall_points_total: null,
          item_position_in_trainer: 5,
          purge_flow: false,
          attempt_result: null,
          attempt_text: null,
          target_text: null
        });
      });

      test('vocabulary_review:trainer_item:attempted', () => {
        expect(vocabReviewTrainerItemAttemptedEvent(state)).toMatchSnapshot();
      });
    });
  });
});
