import { COMPLETE_LESSON } from '../../../src/dux/lesson/types';
import survey from '../../../src/dux/survey/middleware';
import * as actions from '../../../src/dux/survey/actions';
import cookies from '../../../src/lib/cookies';

jest.mock('../../../src/dux/survey/actions', () => ({
  loadSurvey: jest.fn(() => ({ type: 'FAKE_LOAD_SURVEY' }))
}));
jest.mock('../../../src/lib/cookies', () => ({
  getCookie: jest.fn()
}));

// https://redux.js.org/recipes/writing-tests#middleware
const create = () => {
  const store = {
    getState: jest.fn(() => ({})),
    dispatch: jest.fn()
  };

  const next = jest.fn();

  const invoke = (action) => survey(store)(next)(action);

  return { store, next, invoke };
};

describe('Survey Middleware', () => {
  describe('for a COMPLETE_LESSON_FULFILLED action', () => {
    it('passes through the action', () => {
      const { next, invoke } = create();
      const action = { type: `${COMPLETE_LESSON}_FULFILLED` };
      invoke(action);
      expect(next).toHaveBeenCalledWith(action);
    });

    describe('when cookies for the survey campaign are empty', () => {
      beforeEach(() => {
        cookies.getCookie.mockImplementationOnce(() => null);
      });

      it('dispatches loadSurvey', () => {
        const { store, invoke } = create();
        const action = { type: `${COMPLETE_LESSON}_FULFILLED` };
        invoke(action);
        expect(actions.loadSurvey).toHaveBeenCalled();
        expect(store.dispatch).toHaveBeenCalledWith({ type: 'FAKE_LOAD_SURVEY' });
      });
    });

    describe('when cookies for the survey campaign are not empty', () => {
      beforeEach(() => {
        cookies.getCookie.mockImplementationOnce(() => true);
      });

      it('does not dispatches loadSurvey', () => {
        const { store, invoke } = create();
        const action = { type: `${COMPLETE_LESSON}_FULFILLED` };
        invoke(action);
        expect(actions.loadSurvey).not.toHaveBeenCalled();
        expect(store.dispatch).not.toHaveBeenCalledWith({ type: 'FAKE_LOAD_SURVEY' });
      });
    });
  });

  describe('for another action', () => {
    it('passes through the action', () => {
      const { next, invoke } = create();
      const action = { type: 'FOO' };
      invoke(action);
      expect(next).toHaveBeenCalledWith(action);
    });

    it('does not dispatch anything else', () => {
      const { store, invoke } = create();
      const action = { type: 'FOO' };
      invoke(action);
      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });
});
