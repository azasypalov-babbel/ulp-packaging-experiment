import { COMPLETE_TRAINER, START_SEQUENCE, NAVIGATE } from '../../../src/dux/sequence/types';
import sequenceMiddleware from '../../../src/dux/sequence/middleware';
import * as sequenceActions from '../../../src/dux/sequence/actions';

jest.mock('../../../src/dux/sequence/actions', () => ({
  navigate: jest.fn(() => ({ type: 'SEQUENCE/MOCK_NAVIGATE' })),
  startTrainer: jest.fn(() => ({ type: 'SEQUENCE/MOCK_START_TRAINER' })),
  completeSequence: jest.fn(() => ({ type: 'SEQUENCE/MOCK_COMPLETE_SEQUENCE' }))
}));

jest.mock('../../../src/dux/sequence/selectors');

const create = (state) => {
  const store = {
    getState: jest.fn(() => state),
    dispatch: jest.fn()
  };

  const next = jest.fn();

  const invoke = (action) => sequenceMiddleware(store)(next)(action);

  return { store, next, invoke };
};

const defaultState = {
  sequence: {
    currentTrainerIndex: 1,
    trainers: [{}, {}, {}]
  }
};

describe('Sequence Middleware', () => {
  describe('for a START_SEQUENCE action', () => {
    const action = { type: START_SEQUENCE };

    it('passes through the action', () => {
      const { next, invoke } = create(defaultState);
      invoke(action);
      expect(next).toHaveBeenCalledWith(action);
    });

    it('dispatches navigate to first trainer', () => {
      const { invoke, store } = create(defaultState);
      invoke(action);
      expect(sequenceActions.navigate).toHaveBeenCalledWith(0);
      expect(store.dispatch).toHaveBeenCalledWith({ type: 'SEQUENCE/MOCK_NAVIGATE' });
    });
  });

  describe('for a NAVIGATE action', () => {
    const action = { type: NAVIGATE, payload: { trainerIndex: 1 } };

    it('passes through the action', () => {
      const { next, invoke } = create(defaultState);
      invoke(action);
      expect(next).toHaveBeenCalledWith(action);
    });

    it('dispatches start trainer', () => {
      const { invoke, store } = create(defaultState);
      invoke(action);
      expect(sequenceActions.startTrainer).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith({ type: 'SEQUENCE/MOCK_START_TRAINER' });
    });
  });

  describe('for a COMPLETE_TRAINER action', () => {
    const action = { type: COMPLETE_TRAINER };

    it('passes through the action', () => {
      const { next, invoke } = create(defaultState);
      invoke(action);
      expect(next).toHaveBeenCalledWith(action);
    });

    describe('when there are more trainers', () => {
      it('dispatches navigate to next trainer', () => {
        const { invoke, store } = create(defaultState);
        invoke(action);
        expect(sequenceActions.navigate).toHaveBeenCalledWith(2);
        expect(store.dispatch).toHaveBeenCalledWith({ type: 'SEQUENCE/MOCK_NAVIGATE' });
      });
    });

    describe('when there are no more trainers', () => {
      it('dispatches complete sequence', () => {
        const state = {
          ...defaultState,
          sequence: {
            ...defaultState.sequence,
            currentTrainerIndex: 2
          }
        };

        const { invoke, store } = create(state);
        invoke(action);
        expect(sequenceActions.completeSequence).toHaveBeenCalledWith();
        expect(store.dispatch).toHaveBeenCalledWith({ type: 'SEQUENCE/MOCK_COMPLETE_SEQUENCE' });
      });
    });
  });

  describe('for another action', () => {
    it('passes through the action', () => {
      const { next, invoke } = create(defaultState);
      const action = { type: 'FOO' };
      invoke(action);
      expect(next).toHaveBeenCalledWith(action);
    });

    it('does not dispatch anything else', () => {
      const { store, invoke } = create(defaultState);
      const action = { type: 'FOO' };
      invoke(action);
      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });
});
