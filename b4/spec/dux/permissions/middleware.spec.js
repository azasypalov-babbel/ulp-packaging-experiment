import permissionsMiddleware from '../../../src/dux/permissions/middleware';
import { UPDATE_MIC_PERMISSION } from '../../../src/dux/permissions/types';
import { PERMISSIONS_STATUS } from '../../../src/dux/permissions/status';
import { setMicSettings } from '../../../src/dux/session/actions';

import services from '../../../src/services';

jest.mock('../../../src/dux/session/actions');

// https://redux.js.org/recipes/writing-tests#middleware
const create = () => {
  const store = {
    getState: jest.fn(() => ({ permissions: '' })),
    dispatch: jest.fn()
  };

  const next = jest.fn();

  const invoke = (action) => permissionsMiddleware(store)(next)(action);

  return { store, next, invoke };
};

describe('Permissions middleware', () => {
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

    describe('in webview', () => {
      beforeEach(() => {
        jest.spyOn(services.permissionsService, 'resetOnDeniedPermission').mockReturnValue(true);
      });
      afterEach(() => {
        services.permissionsService.resetOnDeniedPermission.mockRestore();
      });
      describe('trainer requires mic permissions', () => {
        describe('for denied permissions', () => {
          it('should change mic setting to disabled', () => {
            invokeMicPermissionsAction(PERMISSIONS_STATUS.denied);
            expect(setMicSettings).toHaveBeenCalledWith(false);
          });
        });

        describe('for granted permissions', () => {
          it('should not change mic setting', () => {
            invokeMicPermissionsAction(PERMISSIONS_STATUS.granted);
            expect(setMicSettings).not.toHaveBeenCalledWith();
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
