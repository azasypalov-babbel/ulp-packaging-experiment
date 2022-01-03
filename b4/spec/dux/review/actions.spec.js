import mockStore from '../mockStore';
import getAwsApiClient from '../../../src/services/awsApiClient';
import reviewService from '../../../src/services/reviewService';
import * as types from '../../../src/dux/review/types';
import {
  attemptItem,
  completeItem,
  completeReview,
  closeReview,
  fetchInteractionTypes,
  fetchNextReviewItems,
  preparePurge,
  setHasNextReviewItems,
  updateInteraction
} from '../../../src/dux/review/actions';
import { getReviewQueryParams, countReviewItems } from '../../../src/dux/review/helpers';
import * as vocabularyReviewEvents from '../../../src/dux/tracker/events/vocabularyReview';
import * as trackingActions from '../../../src/dux/tracker/actions';
import * as sequenceActions from '../../../src/dux/sequence/actions';
import { setMicSettings } from '../../../src/dux/session/actions';

import { isWebview } from '../../../src/lib/features';
jest.mock('../../../src/lib/features');

jest.spyOn(trackingActions, 'track');
jest.spyOn(sequenceActions, 'init');

jest.mock('../../../src/dux/session/actions', () => ({
  navigateToReturnUrl: jest.fn(() => ({ type: 'SESSION/NAVIGATE_TO_RETURN_URL' })),
  setMicSettings: jest.fn(() => ({ type: 'SET_MIC_SETTINGS' }))
}));
jest.mock('../../../src/services/awsApiClient');
jest.mock('../../../src/dux/review/helpers');
jest.mock('../../../src/services/reviewService', () => ({
  updateVocabularyItems: jest.fn().mockResolvedValue({}),
  getReviewTypes: jest.fn().mockResolvedValue({}),
  getReviewItems: jest.fn().mockResolvedValue({}),
  postReviewAborted: jest.fn().mockResolvedValue({}),
  postReviewCompleted: jest.fn().mockResolvedValue({})
}));
jest.mock('../../../src/services/trackingService', () => ({
  track: jest.fn().mockResolvedValue({})
}));
jest.mock('../../../src/dux/tracker/events/vocabularyReview', () => ({
  vocabReviewStartedContinueEvent: jest.fn().mockReturnValue({ event: 'started:continue' }),
  vocabReviewStartedPurgeEvent: jest.fn().mockReturnValue({ event: 'started:purge' }),
  vocabReviewEndedFinishEvent: jest.fn().mockReturnValue({ event: 'ended:finish' }),
  vocabReviewEndedAbortEvent: jest.fn().mockReturnValue({ event: 'ended:abort' }),
  vocabReviewTrainerItemAttemptedEvent: jest.fn().mockReturnValue({ event: 'trainer_item:attempted' })
}));

const getStateMock = jest.fn();

describe('Review Actions', () => {
  const learnLanguageAlpha3 = 'FRA';
  const locale = 'de';
  const trainerItemId = 555;

  getStateMock.mockImplementation(() => ({
    session: { learnLanguageAlpha3, locale },
    sequence: { completed: false }
  }));
  const store = mockStore(getStateMock);

  afterEach(() => {
    store.clearActions();
    getReviewQueryParams.mockClear();
    reviewService.getReviewItems.mockClear();
    reviewService.getReviewTypes.mockClear();
    trackingActions.track.mockClear();
    sequenceActions.init.mockClear();
    setMicSettings.mockClear();
  });

  describe('#completeItem', () => {
    const item = { id: trainerItemId, learnLanguageText: 'bla' };
    const mistakes = { mistakes: 1 };

    describe('with REVIEW_SEARCH session type', () => {
      beforeEach(() => {
        getStateMock.mockImplementation(() => ({ session: { learnLanguageAlpha3, locale, type: 'REVIEW_SEARCH' } }));
      });

      test('dispatches corresponding actions', () => {
        expect.assertions(1);
        const expectedActionTypes = [
          `${types.COMPLETE_ITEM}_PENDING`,
          `${types.COMPLETE_ITEM}_FULFILLED`
        ];

        return store.dispatch(completeItem({ item, mistakes })).then(() => {
          const actionTypes = store.getActions().map((action) => action.type);

          expect(actionTypes).toEqual(expect.arrayContaining(expectedActionTypes));
        });
      });
    });

    describe('with REVIEW_DUE session type', () => {
      beforeEach(() => {
        getStateMock.mockImplementation(() => ({ session: { learnLanguageAlpha3, locale, type: 'REVIEW_DUE' } }));
      });

      test('dispatches corresponding actions', () => {
        expect.assertions(1);
        const expectedActionTypes = [
          `${types.COMPLETE_ITEM}_PENDING`,
          `${types.UPDATE_VOCABULARY_ITEMS}_PENDING`,
          `${types.UPDATE_VOCABULARY_ITEMS}_FULFILLED`,
          `${types.COMPLETE_ITEM}_FULFILLED`
        ];

        return store.dispatch(completeItem({ item, mistakes })).then(() => {
          const actionTypes = store.getActions().map((action) => action.type);

          expect(actionTypes).toEqual(expect.arrayContaining(expectedActionTypes));
        });
      });

      test('calls reviewService updateVocabularyItems', () => {
        expect.assertions(1);
        const vocabularyItems = [{
          id: item.id,
          mistakes
        }];

        return store.dispatch(completeItem({ item, mistakes })).then(() => {
          expect(reviewService.updateVocabularyItems).toHaveBeenCalledWith({
            locale,
            learnLanguageAlpha3,
            vocabularyItems
          });
        });
      });
    });
  });

  describe('#fetchInteractionTypes', () => {
    const params = { filter: 'due' };

    beforeEach(() => {
      getReviewQueryParams.mockReturnValue(params);
      getStateMock.mockImplementation(() => ({ session: { learnLanguageAlpha3, locale, type: 'REVIEW_DUE' } }));
    });

    test(`dispatches ${types.FETCH_INTERACTION_TYPES}`, () => {
      expect.assertions(1);
      return store.dispatch(fetchInteractionTypes()).then(() => {
        expect(store.getActions()).toEqual([
          { type: `${types.FETCH_INTERACTION_TYPES}_PENDING` },
          { type: `${types.FETCH_INTERACTION_TYPES}_FULFILLED`, payload: {} }
        ]);
      });
    });

    test('calls reviewService getReviewTypes', () => {
      expect.assertions(1);
      return store.dispatch(fetchInteractionTypes()).then(() => {
        expect(reviewService.getReviewTypes).toHaveBeenCalledWith({
          locale,
          learnLanguageAlpha3,
          params
        });
      });
    });
  });

  describe('#fetchNextReviewItems', () => {
    const selectedInteraction = 'write';
    const offset = 2;
    const reviewState = {
      selectedInteraction,
      reviewItems: {
        nextParams: {
          offset
        }
      },
      reviewLoopsCounter: 0
    };

    describe('when REVIEW_DUE', () => {
      const queryParams = { filter: 'due' };

      beforeEach(() => {
        getReviewQueryParams.mockReturnValue(queryParams);
        getStateMock.mockImplementation(() => ({
          session: { learnLanguageAlpha3, locale, type: 'REVIEW_DUE' },
          review: reviewState
        }));
      });

      test('calls reviewService #getReviewItems with required parameters', () => {
        expect.assertions(1);

        const params = Object.assign({}, queryParams, {
          interaction_type: selectedInteraction
        });

        return store.dispatch(fetchNextReviewItems()).then(() => {
          expect(reviewService.getReviewItems).toHaveBeenCalledWith({
            locale,
            learnLanguageAlpha3,
            params
          });
        });
      });
    });

    describe('when REVIEW_SEARCH', () => {
      const queryParams = { filter: 'search' };

      beforeEach(() => {
        getReviewQueryParams.mockReturnValue(queryParams);
        getStateMock.mockImplementation(() => ({
          session: { learnLanguageAlpha3, locale, type: 'REVIEW_SEARCH' },
          review: reviewState
        }));
      });

      test('calls reviewService #getReviewItems with required parameters', () => {
        const params = Object.assign({}, queryParams, {
          interaction_type: selectedInteraction,
          offset
        });

        return store.dispatch(fetchNextReviewItems()).then(() => {
          expect(reviewService.getReviewItems).toHaveBeenCalledWith({
            locale,
            learnLanguageAlpha3,
            params
          });
        });
      });
    });
  });

  describe('#setHasNextReviewItems', () => {
    const reviewState = {
      selectedInteraction: 'write',
      reviewItems: {
        remainingItemCount: 3
      }
    };

    describe('when REVIEW_DUE', () => {
      const queryParams = { filter: 'due' };

      beforeEach(() => {
        countReviewItems.mockReturnValue(0);
        getReviewQueryParams.mockReturnValue(queryParams);
        getStateMock.mockImplementation(() => ({
          session: { learnLanguageAlpha3, locale, type: 'REVIEW_DUE' },
          review: reviewState
        }));
        reviewService.getReviewItems.mockResolvedValue({
          _meta: {
            remaining_item_count: 1
          },
          review_session: {
            trainers: []
          }
        });
      });

      test('calls reviewService #getReviewItems with required parameters', () => {
        const params = {
          ...queryParams,
          interaction_type: reviewState.selectedInteraction
        };

        return store.dispatch(setHasNextReviewItems()).then(() => {
          expect(reviewService.getReviewItems).toHaveBeenCalledWith({
            locale,
            learnLanguageAlpha3,
            params
          });
        });
      });
    });

    describe('when REVIEW_SEARCH', () => {
      const queryParams = { filter: 'search' };

      beforeEach(() => {
        getReviewQueryParams.mockReturnValue(queryParams);
        getStateMock.mockImplementation(() => ({
          session: { learnLanguageAlpha3, locale, type: 'REVIEW_SEARCH' },
          review: reviewState
        }));
      });

      test('does not call reviewService #getReviewItems', () => {
        return store.dispatch(setHasNextReviewItems()).then(() => {
          expect(reviewService.getReviewItems).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('#completeReview', () => {
    describe('when in Webview', () => {
      beforeEach(() => {
        isWebview.mockImplementationOnce(() => true);
      });

      test('sends vocabulary review tracking event', () => {
        expect.assertions(2);

        return store.dispatch(completeReview()).then(() => {
          expect(vocabularyReviewEvents.vocabReviewEndedFinishEvent).toHaveBeenCalled();
          expect(trackingActions.track).toHaveBeenCalledWith({ event: 'ended:finish' });
        });
      });

      test('does not dispatch the action to COMPLETE_REVIEW and SET_HAS_NEXT_REVIEW_ITEMS', () => {
        const expectedActionTypes = [
          `${types.COMPLETE_REVIEW}_PENDING`,
          `${types.SET_HAS_NEXT_REVIEW_ITEMS}_PENDING`,
          `${types.SET_HAS_NEXT_REVIEW_ITEMS}_FULFILLED`,
          `${types.COMPLETE_REVIEW}_FULFILLED`
        ];

        return store.dispatch(completeReview()).then(() => {
          const actionTypes = store.getActions().map((action) => action.type);

          expect(actionTypes).toEqual(expect.not.arrayContaining(expectedActionTypes));
        });
      });
    });

    describe('when NOT in Webview', () => {
      beforeEach(() => {
        isWebview.mockImplementationOnce(() => false);
      });

      test('sends vocabulary review tracking event', () => {
        expect.assertions(2);

        return store.dispatch(completeReview()).then(() => {
          expect(vocabularyReviewEvents.vocabReviewEndedFinishEvent).toHaveBeenCalled();
          expect(trackingActions.track).toHaveBeenCalledWith({ event: 'ended:finish' });
        });
      });

      test('dispatches corresponding actions', () => {
        const expectedActionTypes = [
          `${types.COMPLETE_REVIEW}_PENDING`,
          `${types.SET_HAS_NEXT_REVIEW_ITEMS}_PENDING`,
          `${types.SET_HAS_NEXT_REVIEW_ITEMS}_FULFILLED`,
          `${types.COMPLETE_REVIEW}_FULFILLED`
        ];

        return store.dispatch(completeReview()).then(() => {
          const actionTypes = store.getActions().map((action) => action.type);

          expect(actionTypes).toEqual(expect.arrayContaining(expectedActionTypes));
        });
      });
    });
  });

  describe('#closeReview', () => {
    describe('when in Webview', () => {
      beforeEach(() => {
        isWebview.mockImplementationOnce(() => true);
      });

      describe('when the review is completed', () => {
        beforeEach(() => {
          getStateMock.mockImplementationOnce(() => ({
            sequence: { completed: true }
          }));
        });
        test('sends post native message', async () => {
          await store.dispatch(closeReview());

          expect(reviewService.postReviewCompleted).toHaveBeenCalled();
        });
      });
      describe('when the review is not completed', () => {
        beforeEach(() => {
          getStateMock.mockImplementationOnce(() => ({
            sequence: { completed: false }
          }));
        });
        test('sends abort sequence action', async () => {
          await store.dispatch(closeReview());

          const actionTypes = store.getActions().map((action) => action.type);
          expect(actionTypes).toEqual(expect.arrayContaining(
            ['SEQUENCE/ABORT_SEQUENCE']
          ));
        });
        test('sends post native aborted', async () => {
          await store.dispatch(closeReview());

          expect(reviewService.postReviewAborted).toHaveBeenCalled();
        });
      });
    });

    describe('when NOT in Webview', () => {
      beforeEach(() => {
        isWebview.mockImplementationOnce(() => false);
      });

      describe('when the review is completed', () => {
        beforeEach(() => {
          getStateMock.mockImplementationOnce(() => ({
            sequence: { completed: true }
          }));
        });

        test('dispatch navigateToReturnUrl session action', () => {
          const expectedActionTypes = [
            'SESSION/NAVIGATE_TO_RETURN_URL'
          ];

          store.dispatch(closeReview());
          const actionTypes = store.getActions().map((action) => action.type);

          expect(actionTypes).toEqual(expect.arrayContaining(expectedActionTypes));
        });
      });

      describe('when the review is not completed', () => {
        beforeEach(() => {
          getStateMock.mockImplementationOnce(() => ({
            sequence: { completed: false }
          }));
        });

        /**
         * On web, abort sequence will be triggered when the page navigates away
         * from the lesson-player. This will happen following the navigation to return url.
         */
        test('does not send abort sequence action', async () => {
          await store.dispatch(closeReview());

          const actionTypes = store.getActions().map((action) => action.type);
          expect(actionTypes).not.toEqual(expect.arrayContaining(
            ['SEQUENCE/ABORT_SEQUENCE']
          ));
        });

        test('dispatch navigateToReturnUrl session action', () => {
          const expectedActionTypes = [
            'SESSION/NAVIGATE_TO_RETURN_URL'
          ];

          store.dispatch(closeReview());
          const actionTypes = store.getActions().map((action) => action.type);

          expect(actionTypes).toEqual(expect.arrayContaining(expectedActionTypes));
        });
      });
    });
  });

  describe('#updateInteraction', () => {
    test('dispatches corresponding actions', () => {
      const expectedActionTypes = [
        types.UPDATE_INTERACTION
      ];

      store.dispatch(updateInteraction());

      const actionTypes = store.getActions().map((action) => action.type);

      expect(actionTypes).toEqual(expect.arrayContaining(expectedActionTypes));
    });
  });

  describe('#preparePurge', () => {
    test('sends vocabulary review tracking event', () => {
      expect.assertions(2);

      return store.dispatch(preparePurge()).then(() => {
        expect(vocabularyReviewEvents.vocabReviewStartedPurgeEvent).toHaveBeenCalled();
        expect(trackingActions.track).toHaveBeenCalledWith({ event: 'started:purge' });
      });
    });
  });

  describe('#attemptItem', () => {
    test('sends vocabulary review tracking event', () => {
      expect.assertions(2);

      const item = {
        id: '1',
        learn_language_text: '(*foo)'
      };
      const attempt = {
        solved: true,
        text: 'foo'
      };

      return store.dispatch(attemptItem(item, attempt)).then(() => {
        expect(vocabularyReviewEvents.vocabReviewTrainerItemAttemptedEvent).toHaveBeenCalled();
        expect(trackingActions.track).toHaveBeenCalledWith({
          event: 'trainer_item:attempted',
          payload: {
            attempt_result: 'solved',
            attempt_text: 'foo',
            target_text: '(*foo)'
          }
        });
      });
    });
  });

  describe('with empty nextParams in review state for REVIEW_SEARCH', () => {
    const MOCKED_STATE = {
      session: { learnLanguageAlpha3, locale, type: 'REVIEW_SEARCH' },
      review: {
        selectedInteraction: 'write',
        reviewItems: {
          nextParams: {}
        }
      }
    };

    const mockFetch = jest.fn(() => Promise.resolve({}));
    const getReviewItems = jest.fn(
      jest.requireActual('../../../src/services/reviewService').default.getReviewItems
    );

    afterEach(() => {
      getAwsApiClient.mockReset();
      reviewService.getReviewItems.mockReset();
    });

    beforeEach(async () => {
      getStateMock.mockReturnValue(MOCKED_STATE);

      getAwsApiClient.mockImplementation(() => ({
        authenticate: jest.fn(() => Promise.resolve('MOCKED_UUID')),
        fetch: mockFetch
      }));

      // un-mocking getReviewItems() in order to test api client invocation
      reviewService.getReviewItems.mockImplementation(getReviewItems);
      await store.dispatch(fetchNextReviewItems());
    });

    test('fetchNextReviewItems passes valid params', () => {
      expect(mockFetch).toHaveBeenCalledWith(expect.objectContaining({
        query: expect.not.objectContaining({
          offset: undefined
        })
      }));
    });
  });
});
