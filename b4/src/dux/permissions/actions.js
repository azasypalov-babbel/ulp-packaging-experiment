import * as types from './types';
import { track } from '../tracker/actions';
import { PERMISSIONS_STATUS } from './status';
import { getLocalStorage } from '../../lib/localStorage';
import services from '../../services';


export const LOCALSTORAGE_NAMESPACE = 'SPEECH_RECOGNITION';
export const PERMISSION_COMPLETED_KEY = 'MIC_PERMISSION_COMPLETED';

const localStorage = getLocalStorage(LOCALSTORAGE_NAMESPACE);

const PERMISSIONS_EVENT_STATUS = {
  [PERMISSIONS_STATUS.prompt]: 'not_determined',
  [PERMISSIONS_STATUS.dismissed]: 'dismissed',
  [PERMISSIONS_STATUS.granted]: 'authorized',
  [PERMISSIONS_STATUS.denied]: 'denied'
};

const updateMicPermission = (micPermission) => {
  return {
    type: types.UPDATE_MIC_PERMISSION,
    payload: micPermission
  };
};

export const initMicPermissions = () => (dispatch) => {
  const { permissionsService } = services;

  const payload = permissionsService.init()
    .then(({ status, subscribe } = {}) => {
      if (status) {
        dispatch(updateMicPermission(status));
      }

      if (subscribe) {
        subscribe((status) => {
          dispatch(updateMicPermission(status));
        });
      }
    });

  return dispatch({
    type: types.INIT_MIC_PERMISSIONS,
    payload
  });
};

export const trackPermissionMicStatus = () => (dispatch, getState) => {
  return dispatch(track({
    event: 'permissions:mic:status',
    version: 1,
    payload: {
      origin: 'lesson_player',
      status: PERMISSIONS_EVENT_STATUS[getState().permissions.micPermission],
      // eslint-disable-next-line camelcase
      learn_language_alpha3: getState().session.learnLanguageAlpha3,
      locale: getState().session.locale
    }
  }));
};

export const trackPermissionMicRequested = () => (dispatch, getState) => {
  return dispatch(track({
    event: 'permissions:mic:requested',
    version: 1,
    payload: {
      origin: 'lesson_player',
      status: PERMISSIONS_EVENT_STATUS[getState().permissions.micPermission],
      // eslint-disable-next-line camelcase
      learn_language_alpha3: getState().session.learnLanguageAlpha3,
      locale: getState().session.locale
    }
  }));
};

export const requestMicPermissions = () => (dispatch, getState) => {
  const micPermission = getState().permissions.micPermission;
  const { permissionsService } = services;

  dispatch(trackPermissionMicStatus());

  if (micPermission === PERMISSIONS_STATUS.prompt) {
    const payload = permissionsService.prompt()
      .then((status) => {
        dispatch(updateMicPermission(status));
      })
      .finally(() => {
        dispatch(trackPermissionMicRequested());
      });

    return dispatch({ type: types.REQUEST_MIC_PERMISSIONS, payload });
  }

  if (micPermission === PERMISSIONS_STATUS.denied) {
    const payload = permissionsService.prompt();
    /*
     * User has already selected to block mic permissions, browser or iOS won't ask again.
     * Yet, browser (small icon in url bar) and iOS (prompt to access settings) present the
     * user with a means to change setting manually.
     */
    return dispatch({ type: types.REQUEST_MIC_PERMISSIONS, payload });
  }

  return dispatch({ type: types.REQUEST_MIC_PERMISSIONS, payload: Promise.resolve() });
};

export const setPermissionCompleted = (completed) => (dispatch) => {
  localStorage.set(PERMISSION_COMPLETED_KEY, completed);
  return dispatch({
    type: types.SET_PERMISSION_COMPLETED,
    payload: completed
  });
};
