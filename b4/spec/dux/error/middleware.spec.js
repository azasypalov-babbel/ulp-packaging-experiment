import errorMiddleware from '../../../src/dux/error/middleware';
import rollbar from '../../../src/services/rollbarService';
import * as messagesActions from '../../../src/dux/messages/actions';
import { MESSAGE_KEYS } from '../../../src/dux/messages/messageKeys';
import * as trackerTypes from '../../../src/dux/tracker/types';

jest.mock('../../../src/dux/messages/actions');

// https://redux.js.org/recipes/writing-tests#middleware
const create = () => {
  const store = {
    getState: jest.fn(() => ({})),
    dispatch: jest.fn()
  };

  const next = jest.fn((action) => action.payload);

  const invoke = (action) => errorMiddleware(store)(next)(action);

  return { store, next, invoke };
};

describe('Error middleware', () => {
  beforeAll(() => {
    global.ProgressEvent = jest.fn();
  });

  it('passes through the action', () => {
    const { next, invoke } = create();
    const action = { type: 'SOME_ACTION' };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  describe('when payload contains promise', () => {
    const action = {
      type: 'SOME_ACTION',
      payload: Promise.resolve()
    };
    it('passes through the action', () => {
      const { next, invoke } = create();
      invoke(action);
      expect(next).toHaveBeenCalledWith(action);
    });

    describe('promise rejects with error', () => {
      const error = new Error('Something went wrong');
      const action = {
        type: 'SOME_ACTION',
        payload: Promise.reject(error)
      };
      it('passes through the action', () => {
        const { next, invoke } = create();
        return invoke(action).then(() => {
          expect(next).toHaveBeenCalledWith(action);
        });
      });
      it('should track error to rollbar', () => {
        const { invoke } = create();
        return invoke(action).then(() => {
          expect(rollbar.error).toHaveBeenCalledWith(
            'UnhandledActionException@SOME_ACTION: Something went wrong',
            { error }
          );
        });
      });

      describe('Custom offline Error', () => {
        let invokeType;
        let error;
        beforeEach(() => {
          error = new Error('Error while sending request to tracker');
          error.status = 0;
          error.readyState = 0;
          const { invoke } = create();
          invokeType = (type) => invoke({
            type,
            payload: Promise.reject(error)
          });
        });
        it('should debug error to rollbar', () => {
          return invokeType('SOME_ACTION').then(() => {
            expect(rollbar.debug).toHaveBeenCalledWith(
              'NetworkError@SOME_ACTION: offline',
              { error }
            );
          });
        });
        it('should add "network" message to ui', () => {
          return invokeType('SOME_ACTION').then(() => {
            expect(messagesActions.addMessage).toHaveBeenCalledWith(
              MESSAGE_KEYS.NETWORK
            );
          });
        });

        describe('for non critical action failures', () => {
          it('should not add message to ui', () => {
            return invokeType(trackerTypes.TRACK).then(() => {
              expect(messagesActions.addMessage).not.toHaveBeenCalled();
            });
          });
        });
      });

      describe('XMLHttpRequest offline Error (axios)', () => {
        let invokeType;
        let error;
        beforeEach(() => {
          error = new Error();
          error.request = new XMLHttpRequest();
          const { invoke } = create();
          invokeType = (type) => invoke({
            type,
            payload: Promise.reject(error)
          });
        });
        it('should debug error to rollbar', () => {
          return invokeType('SOME_ACTION').then(() => {
            expect(rollbar.debug).toHaveBeenCalledWith(
              'NetworkError@SOME_ACTION: offline',
              { error }
            );
          });
        });

        it('should add "network" message to ui', () => {
          return invokeType('SOME_ACTION').then(() => {
            expect(messagesActions.addMessage).toHaveBeenCalledWith(
              MESSAGE_KEYS.NETWORK
            );
          });
        });

        describe('for tracking event errors', () => {
          it('should not add message to ui', () => {
            return invokeType(trackerTypes.TRACK).then(() => {
              expect(messagesActions.addMessage).not.toHaveBeenCalled();
            });
          });
        });
      });

      describe('Unhandled exception in action', () => {
        let invokeType;
        let error;
        beforeEach(() => {
          error = new Error('Something went wrong');
          const { invoke } = create();
          invokeType = (type) => invoke({
            type,
            payload: Promise.reject(error)
          });
        });
        it('should log error to rollbar', () => {
          return invokeType('SOME_ACTION').then(() => {
            expect(rollbar.error).toHaveBeenCalledWith(
              'UnhandledActionException@SOME_ACTION: Something went wrong',
              { error }
            );
          });
        });

        it('should add "generic" message to ui', () => {
          return invokeType('SOME_ACTION').then(() => {
            expect(messagesActions.addMessage).toHaveBeenCalledWith(
              MESSAGE_KEYS.GENERIC
            );
          });
        });
      });
    });
  });
});
