import mockStore from '../mockStore';
import {
  trackPermissionMicStatus,
  trackPermissionMicRequested,
  requestMicPermissions,
  initMicPermissions,
  setPermissionCompleted
} from '../../../src/dux/permissions/actions';
import permissionsService from '../../../src/services/permissions/service';

import * as trackingActions from '../../../src/dux/tracker/actions';
import {
  UPDATE_MIC_PERMISSION,
  SET_PERMISSION_COMPLETED
} from '../../../src/dux/permissions/types';
jest.spyOn(trackingActions, 'track');

jest.mock('../../../src/services/permissions/service', () => ({
  init: jest.fn().mockResolvedValue({ status: 'granted', subscribe: jest.fn() }),
  prompt: jest.fn().mockResolvedValue('granted')
}));
jest.mock('../../../src/services/trackingService', () => ({
  track: jest.fn().mockResolvedValue({})
}));

describe('permissions actions', () => {
  const dispatchMock = jest.fn();

  const defaultState = {
    session: {
      locale: 'fr',
      learnLanguageAlpha3: 'DEU'
    }
  };

  afterEach(() => {
    dispatchMock.mockClear();
  });

  describe('#initMicPermissions', () => {
    const store = mockStore();
    afterEach(() => {
      store.clearActions();
    });

    test('updates mic permissions with initial value', () => {
      permissionsService.init.mockResolvedValueOnce({ status: 'declined', subscribe: jest.fn() }),
      expect.assertions(1);
      return store.dispatch(initMicPermissions()).then(() => {
        expect(store.getActions()).toContainEqual({
          type: UPDATE_MIC_PERMISSION,
          payload: 'declined'
        });
      });
    });

    test('subscribes to changes on mic permissions', () => {
      let invokeHandler;
      const subscribeMock = jest.fn((handler) => { invokeHandler = handler; });

      permissionsService.init.mockResolvedValueOnce({ status: 'declined', subscribe: subscribeMock }),
      expect.assertions(2);
      return store.dispatch(initMicPermissions()).then(() => {
        expect(subscribeMock).toHaveBeenCalled();
        invokeHandler();
        expect(store.getActions()).toContainEqual({
          type: UPDATE_MIC_PERMISSION,
          payload: 'declined'
        });
      });
    });
  });


  describe('#trackPermissionMicStatus', () => {
    test('sends permission mic status tracking event', () => {
      const getStateMock = jest.fn(() => ({
        ...defaultState,
        permissions: {
          micPermission: 'prompt'
        }
      }));
      trackPermissionMicStatus()(dispatchMock, getStateMock);

      expect(trackingActions.track).toHaveBeenCalledWith({
        event: 'permissions:mic:status',
        version: 1,
        payload: {
          origin: 'lesson_player',
          status: 'not_determined',
          // eslint-disable-next-line camelcase
          learn_language_alpha3: 'DEU',
          locale: 'fr'
        }
      });
    });
  });

  describe('#trackPermissionMicRequested', () => {
    test('sends permission mic requested tracking event', () => {
      const getStateMock = jest.fn(() => ({
        ...defaultState,
        permissions: {
          micPermission: 'granted'
        }
      }));
      trackPermissionMicRequested()(dispatchMock, getStateMock);

      expect(trackingActions.track).toHaveBeenCalledWith({
        event: 'permissions:mic:requested',
        version: 1,
        payload: {
          origin: 'lesson_player',
          status: 'authorized',
          // eslint-disable-next-line camelcase
          learn_language_alpha3: 'DEU',
          locale: 'fr'
        }
      });
    });
  });

  describe('#requestMicPermissions', () => {
    describe('with "prompt" permissions', () => {
      const getStateMock = jest.fn(() => ({
        ...defaultState,
        permissions: {
          micPermission: 'prompt'
        }
      }));

      const store = mockStore(getStateMock);

      test('should prompt the user for permissions', () => {
        expect.assertions(1);
        return store.dispatch(requestMicPermissions()).then(() => {
          expect(permissionsService.prompt).toHaveBeenCalled();
        });
      });

      test('should track permissions events', () => {
        expect.assertions(1);
        return store.dispatch(requestMicPermissions()).then(() => {
          expect(trackingActions.track).toHaveBeenCalledTimes(2);
        });
      });

      describe('when user dismisses dialogue', () => {
        beforeEach(() => {
          permissionsService.prompt.mockResolvedValue('dismissed');
        });
        test('calls mic permissions action with dismissed', () => {
          expect.assertions(1);
          return store.dispatch(requestMicPermissions()).then(() => {
            expect(store.getActions()).toContainEqual(expect.objectContaining({
              type: UPDATE_MIC_PERMISSION,
              payload: 'dismissed'
            }));
          });
        });
      });
    });

    describe('with "denied" permissions', () => {
      const getStateMock = jest.fn(() => ({
        ...defaultState,
        permissions: {
          micPermission: 'denied'
        }
      }));

      const store = mockStore(getStateMock);

      afterEach(() => {
        store.clearActions();
      });

      test('should prompt the user for permissions', () => {
        expect.assertions(1);
        return store.dispatch(requestMicPermissions()).then(() => {
          expect(permissionsService.prompt).toHaveBeenCalledWith();
        });
      });
    });

    describe('with "granted" permissions', () => {
      const getStateMock = jest.fn(() => ({
        ...defaultState,
        permissions: {
          micPermission: 'granted'
        }
      }));

      const store = mockStore(getStateMock);

      afterEach(() => {
        store.clearActions();
      });

      test('should not prompt the user for permissions', () => {
        expect.assertions(1);
        return store.dispatch(requestMicPermissions()).then(() => {
          expect(permissionsService.prompt).not.toHaveBeenCalled();
        });
      });
    });

    describe('with "dismissed" permissions', () => {
      const getStateMock = jest.fn(() => ({
        ...defaultState,
        permissions: {
          micPermission: 'dismissed'
        }
      }));

      const store = mockStore(getStateMock);

      afterEach(() => {
        store.clearActions();
      });

      test('should not prompt the user for permissions', () => {
        expect.assertions(1);
        return store.dispatch(requestMicPermissions()).then(() => {
          expect(permissionsService.prompt).not.toHaveBeenCalled();
        });
      });
    });

    describe('permissions tracking', () => {
      const getStateMock = jest.fn(() => ({
        ...defaultState,
        permissions: {
          micPermission: 'granted'
        }
      }));

      const store = mockStore(getStateMock);

      afterEach(() => {
        store.clearActions();
      });
      test('dispatches track mic permissions status', () => {
        expect.assertions(1);

        return store.dispatch(requestMicPermissions()).then(() => {
          expect(trackingActions.track).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});

describe('Mic permission actions', () => {
  describe('setPermissionCompleted', () => {
    it('should dispatch action with payload', () => {
      const payload = true;
      const dispatchMock = jest.fn();
      setPermissionCompleted(payload)(dispatchMock);
      expect(dispatchMock).toHaveBeenCalledWith({
        type: SET_PERMISSION_COMPLETED,
        payload
      });
    });
  });
});
