import * as sequenceTypes from '../../../src/dux/sequence/types';
import * as reviewTypes from '../../../src/dux/review/types';
import middleware from '../../../src/dux/tracker/middlewareReview';
import * as vocabularyReviewEvents from '../../../src/dux/tracker/events/vocabularyReview';
import { isWebview } from '../../../src/lib/features';

jest.mock('../../../src/lib/features');
jest.mock('../../../src/dux/session/selectors');
jest.mock('../../../src/dux/tracker/events/vocabularyReview');

jest.mock('../../../src/dux/tracker/actions', () => ({
  track: jest.fn(() => ({ type: 'FAKE_TRACK' }))
}));

// https://redux.js.org/recipes/writing-tests#middleware
const create = () => {
  const store = {
    getState: jest.fn(() => ({
      review: {}
    })),
    dispatch: jest.fn()
  };

  const next = jest.fn();

  const invoke = (action) => middleware(store)(next)(action);

  return { store, next, invoke };
};

describe('Tracker Middleware in review', () => {
  describe('for a INIT action', () => {
    let invoke;
    let next;
    let store;

    const action = {
      type: sequenceTypes.INIT
    };

    beforeEach(() => {
      const middleware = create();

      next = middleware.next;
      invoke = middleware.invoke;
      store = middleware.store;
    });

    it('passes through the action', () => {
      invoke(action);

      expect(next).toHaveBeenCalledWith(action);
    });

    describe('when initial review loop', () => {
      beforeEach(() => {
        store.getState.mockImplementation(() => ({
          review: { reviewLoopsCounter: 0 }
        }));
      });

      afterEach(() => {
        store.getState.mockClear();
      });

      it('does not track any event', () => {
        expect(store.dispatch).not.toHaveBeenCalledWith({ type: 'FAKE_TRACK' });
      });
    });

    describe('when second review loop', () => {
      beforeEach(() => {
        store.getState.mockImplementation(() => ({
          review: { reviewLoopsCounter: 2 }
        }));
      });

      afterEach(() => {
        store.getState.mockClear();
      });

      it('dispatches track of review started continue', () => {
        const eventSpy = jest.spyOn(vocabularyReviewEvents, 'vocabReviewStartedContinueEvent');
        eventSpy.mockImplementation(() => [{ type: 'bar' }]);

        invoke(action);

        expect(eventSpy).toHaveBeenCalledWith(store.getState());
        expect(store.dispatch).toHaveBeenCalledWith({ type: 'FAKE_TRACK' });
      });
    });
  });

  describe('for REVIEW/UPDATE_INTERACTION action', () => {
    let invoke;
    let next;
    let store;

    const action = {
      type: reviewTypes.UPDATE_INTERACTION
    };

    beforeEach(() => {
      const middleware = create();

      next = middleware.next;
      invoke = middleware.invoke;
      store = middleware.store;
    });

    it('passes through the action', () => {
      invoke(action);

      expect(next).toHaveBeenCalledWith(action);
    });

    describe('when in webview', () => {
      beforeEach(() => {
        store.getState.mockImplementation(() => ({
          review: { selectedInteraction: 'mocked-review-type' }
        }));
        isWebview.mockImplementationOnce(() => true);
      });

      afterEach(() => {
        store.getState.mockClear();
      });

      it('does not track type_chosen event', () => {
        const eventSpy = jest.spyOn(vocabularyReviewEvents, 'vocabReviewTypeChosenEvent');
        eventSpy.mockImplementation(() => [{ review_type: 'mocked-review-type' }]);

        invoke(action);

        expect(eventSpy).not.toHaveBeenCalledWith(store.getState());
        expect(store.dispatch).not.toHaveBeenCalledWith({ type: 'FAKE_TRACK' });
      });
    });

    describe('when not in webview', () => {
      beforeEach(() => {
        store.getState.mockImplementation(() => ({
          review: { selectedInteraction: 'mocked-review-type' }
        }));
        isWebview.mockImplementationOnce(() => false);
      });

      afterEach(() => {
        store.getState.mockClear();
      });

      it('tracks type_chosen event', () => {
        const eventSpy = jest.spyOn(vocabularyReviewEvents, 'vocabReviewTypeChosenEvent');
        eventSpy.mockImplementation(() => [{ review_type: 'fake-review-type' }]);

        invoke(action);

        expect(eventSpy).toHaveBeenCalledWith(store.getState());
        expect(store.dispatch).toHaveBeenCalledWith({ type: 'FAKE_TRACK' });
      });
    });
  });

  describe('for another action', () => {
    const action = { type: 'FOO' };

    it('passes through the action', () => {
      const { invoke, next } = create();
      invoke(action);
      expect(next).toHaveBeenCalledWith(action);
    });

    it('does not dispatch anything else', () => {
      const { invoke, store } = create();
      invoke(action);
      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });
});
