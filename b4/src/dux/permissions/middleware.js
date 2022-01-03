import * as permissionsTypes from '../permissions/types';
import { PERMISSIONS_STATUS } from '../permissions/status';
import { setMicSettings } from '../session/actions';
import services from '../../services';

const permissions = (store) => (next) => (action) => {
  const result = next(action);

  if (
    services.permissionsService.resetOnDeniedPermission() &&
    action.type === permissionsTypes.UPDATE_MIC_PERMISSION &&
    action.payload === PERMISSIONS_STATUS.denied
  ) {
    /*
     * In webview we want to switch the user to show interaction for a lesson if they fail to accept mic permissions.
     */
    store.dispatch(setMicSettings(false));
  }

  return result;
};

export default permissions;
