import * as sequenceTypes from '../../../src/dux/sequence/types';
import middleware from '../../../src/dux/tracker/middlewareLesson';
import * as lessonSessionEvents from '../../../src/dux/tracker/events/lessonSession';
import * as lessonEvents from '../../../src/dux/tracker/events/lesson';
import * as contentSelectors from '../../../src/dux/content/selectors';
import rollbar from '../../../src/services/rollbarService';

jest.mock('../../../src/dux/tracker/events/lessonSession');
jest.mock('../../../src/dux/tracker/events/lesson');
jest.mock('../../../src/dux/content/selectors');

jest.mock('../../../src/dux/tracker/actions', () => ({
  track: jest.fn(() => ({ type: 'FAKE_TRACK' }))
}));

// https://redux.js.org/recipes/writing-tests#middleware
const create = () => {
  const store = {
    getState: jest.fn(() => ({
      lesson: {},
      content: {},
      account: { data: { uuid: '' } }
    })),
    dispatch: jest.fn()
  };

  const next = jest.fn();

  const invoke = (action) => middleware(store)(next)(action);

  return { store, next, invoke };
};

describe('Tracker Middleware in lesson', () => {
  let invoke;
  let next;
  let store;

  describe('for a INIT action', () => {
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

    describe('when current lesson is not defined', () => {
      beforeEach(() => {
        contentSelectors.currentLesson.mockImplementation(() => null);
      });

      afterEach(() => {
        contentSelectors.currentLesson.mockClear();
      });

      it('fires rollbar error', () => {
        invoke(action);

        expect(rollbar.error).toHaveBeenCalled();
      });
    });

    describe('when current lesson is completed', () => {
      beforeEach(() => {
        contentSelectors.currentLesson.mockImplementation(() => ({
          completed: true
        }));
      });

      afterEach(() => {
        contentSelectors.currentLesson.mockClear();
      });

      it('dispatches track of lesson restarted', () => {
        const eventSpy = jest.spyOn(lessonEvents, 'lessonRestartedEvent');

        invoke(action);

        expect(eventSpy).toHaveBeenCalledWith(store.getState());
        expect(store.dispatch).toHaveBeenCalledWith({ type: 'FAKE_TRACK' });
      });
    });

    describe('when current lesson is not completed', () => {
      beforeEach(() => {
        contentSelectors.currentLesson.mockImplementation(() => ({
          completed: false
        }));
      });

      afterEach(() => {
        contentSelectors.currentLesson.mockClear();
      });

      it('dispatches track of lesson started', () => {
        const eventSpy = jest.spyOn(lessonEvents, 'lessonStartedEvent');

        invoke(action);

        expect(eventSpy).toHaveBeenCalledWith(store.getState());
        expect(store.dispatch).toHaveBeenCalledWith({ type: 'FAKE_TRACK' });
      });
    });
  });

  describe('for a START_TRAINER action', () => {
    const action = {
      type: sequenceTypes.START_TRAINER
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

    it('dispatches track of lesson session trainer started', () => {
      const eventSpy = jest.spyOn(lessonSessionEvents, 'lessonSessionTrainerStartedEvent');

      invoke(action);

      expect(eventSpy).toHaveBeenCalledWith(store.getState());
      expect(store.dispatch).toHaveBeenCalledWith({ type: 'FAKE_TRACK' });
    });
  });

  describe('for a COMPLETE_TRAINER action', () => {
    const action = {
      type: sequenceTypes.COMPLETE_TRAINER
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

    it('dispatches track of lesson session trainer finished', () => {
      const eventSpy = jest.spyOn(lessonSessionEvents, 'lessonSessionTrainerFinishedEvent');

      invoke(action);

      expect(eventSpy).toHaveBeenCalledWith(store.getState());
      expect(store.dispatch).toHaveBeenCalledWith({ type: 'FAKE_TRACK' });
    });
  });

  describe('for a COMPLETE_SEQUENCE action', () => {
    const action = {
      type: sequenceTypes.COMPLETE_SEQUENCE
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

    it('dispatches track of lesson session ended finished', () => {
      const eventSpy = jest.spyOn(lessonSessionEvents, 'lessonSessionEndedFinishEvent');

      invoke(action);

      expect(eventSpy).toHaveBeenCalledWith(store.getState());
      expect(store.dispatch).toHaveBeenCalledWith({ type: 'FAKE_TRACK' });
    });
  });

  describe('for a ATTEMPT_ITEM action', () => {
    const action = {
      type: sequenceTypes.ATTEMPT_ITEM,
      payload: {
        item: {},
        attempt: {},
        trainerData: {}
      }
    };

    beforeEach(() => {
      const middleware = create();

      next = middleware.next;
      invoke = middleware.invoke;
      store = middleware.store;

      lessonEvents.lessonTrainerItemAttemptedEvent.mockImplementation(() => ({
        payload: {}
      }));
    });

    it('passes through the action', () => {
      invoke(action);

      expect(next).toHaveBeenCalledWith(action);
    });

    it('dispatches track of lesson trainer item attempted', () => {
      invoke(action);

      expect(lessonEvents.lessonTrainerItemAttemptedEvent).toHaveBeenCalledWith(store.getState());
      expect(store.dispatch).toHaveBeenCalledWith({ type: 'FAKE_TRACK' });
    });
  });

  describe('for a SKIP_ITEM action', () => {
    const action = {
      type: sequenceTypes.SKIP_ITEM,
      payload: {
        item: {},
        attempt: {},
        trainerData: {}
      }
    };

    beforeEach(() => {
      const middleware = create();

      next = middleware.next;
      invoke = middleware.invoke;
      store = middleware.store;

      lessonEvents.lessonTrainerItemSkippedEvent.mockImplementation(() => ({
        payload: {}
      }));
    });

    it('passes through the action', () => {
      invoke(action);

      expect(next).toHaveBeenCalledWith(action);
    });

    it('dispatches track of lesson trainer item skipped', () => {
      invoke(action);

      expect(lessonEvents.lessonTrainerItemSkippedEvent).toHaveBeenCalledWith(store.getState());
      expect(store.dispatch).toHaveBeenCalledWith({ type: 'FAKE_TRACK' });
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
