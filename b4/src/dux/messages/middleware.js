import * as permissionsTypes from '../permissions/types';
import { addMessage, removeMessage } from './actions';
import { PERMISSIONS_STATUS } from '../permissions/status';
import { isMicEnabled } from '../session/selectors';
import { MESSAGE_KEYS } from './messageKeys';

const messages = (store) => (next) => (action) => {
  const result = next(action);

  const isMicPermissionAction = [
    permissionsTypes.UPDATE_MIC_PERMISSION,
    `${permissionsTypes.REQUEST_MIC_PERMISSIONS}_FULFILLED`
  ].includes(action.type);

  if (isMicPermissionAction) {
    const { session, permissions } = store.getState();
    const micPermission = action.payload || permissions.micPermission;

    const permissionsGranted = [
      PERMISSIONS_STATUS.prompt,
      PERMISSIONS_STATUS.granted
    ].includes(micPermission);

    const trainerRequiresMicPermission = isMicEnabled(session);

    if (!permissionsGranted && trainerRequiresMicPermission) {
      store.dispatch(addMessage(MESSAGE_KEYS.MIC_PERMISSIONS));
    } else {
      store.dispatch(removeMessage(MESSAGE_KEYS.MIC_PERMISSIONS));
    }
  }

  return result;
};

export default messages;
