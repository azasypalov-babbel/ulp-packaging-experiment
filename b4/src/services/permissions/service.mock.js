import AbstractPermissionsService from './abstract';
import { PERMISSIONS_STATUS } from './constants';

export class PermissionsService extends AbstractPermissionsService {
  init() {
    return Promise.resolve({
      status: 'granted',
      subscribe: () => {}
    });
  }

  prompt() {
    return Promise.resolve(PERMISSIONS_STATUS.granted);
  }

/**
 * When microphone permission was denied, learners may be reminded to re-engage with permissions.
 * To enable that, this method would return true.
 */
  resetOnDeniedPermission() {
    return false;
  }
}

export default new PermissionsService();
