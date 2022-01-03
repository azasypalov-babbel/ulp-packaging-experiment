import messagesMiddleware from '../../../src/dux/messages/middleware';
import { UPDATE_MIC_PERMISSION } from '../../../src/dux/permissions/types';
import { PERMISSIONS_STATUS } from '../../../src/dux/permissions/status';
import { ADD_MESSAGE, REMOVE_MESSAGE } from '../../../src/dux/messages/types';

import { isMicEnabled } from '../../../src/dux/session/selectors';
import { MESSAGE_KEYS } from '../../../src/dux/messages/messageKeys';

jest.mock('../../../src/dux/session/selectors');
jest.mock('../../../src/dux/sequence/selectors');
jest.mock('../../../src/dux/review/selectors');

// https://redux.js.org/recipes/writing-tests#middleware
const create = () => {
  const store = {
    getState: jest.fn(() => ({ permissions: '' })),
    dispatch: jest.fn()
  };

  const next = jest.fn();

  const invoke = (action) => messagesMiddleware(store)(next)(action);

  return { store, next, invoke };
};

describe('Messages middleware', () => {
  describe('for a UPDATE_MIC_PERMISSION action', () => {
    const invokeMicPermissionsAction = (payload) => {
      const { store, invoke } = create();
      const action = { type: UPDATE_MIC_PERMISSION, payload };
      invoke(action);
      return store.dispatch;
    };
    it('passes through the action', () => {
      const { next, invoke } = create();
      const action = { type: UPDATE_MIC_PERMISSION };
      invoke(action);
      expect(next).toHaveBeenCalledWith(action);
    });

    describe('trainer requires mic permissions', () => {
      beforeEach(() => {
        isMicEnabled.mockImplementationOnce(() => true);
      });
      describe('for dismissed permissions', () => {
        it('should dispatch add message action', () => {
          expect(invokeMicPermissionsAction(PERMISSIONS_STATUS.dismissed)).toHaveBeenCalledWith({
            type: ADD_MESSAGE,
            payload: MESSAGE_KEYS.MIC_PERMISSIONS
          });
        });
      });

      describe('for granted permissions', () => {
        it('should dispatch add message action', () => {
          expect(invokeMicPermissionsAction(PERMISSIONS_STATUS.granted)).toHaveBeenCalledWith({
            type: REMOVE_MESSAGE,
            payload: MESSAGE_KEYS.MIC_PERMISSIONS
          });
        });
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
