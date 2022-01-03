import AbstractPermissionsService from './abstract';
import { PERMISSIONS_STATUS } from './constants';

const cleanupMediaStream = (stream) => {
  stream.getTracks().forEach((track) => track.stop());
};

export class PermissionsService extends AbstractPermissionsService {
  init() {
    return Promise.resolve()
      .then(() => navigator.permissions
        .query({ name: 'microphone' })
        .then((permissionStatus) => {
          const status = permissionStatus.state;
          const subscribe = (handler) => {
            permissionStatus.addEventListener('change', (event) => {
              return handler(event.target.state);
            });
          };
          return {
            status,
            subscribe
          };
        })
      )
  /*
   * This will catch serveral cases
   * - navigator.permissions is undefined (Safari)
   * - 'microphone' is not a valid value for enumeration PermissionName (Firefox)
   */
      .catch(() => {});
  }

  prompt() {
    return navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(cleanupMediaStream)
      .then(() => PERMISSIONS_STATUS.granted)
      .catch((error) => {
        if (error.name === 'NotAllowedError') {
          if (error.message.includes('dismissed')) {
          /*
           * Chrome has a third option on the dialog, where the user can dismiss the alert,
           * not yet choosing to accept or block.
           */
            return PERMISSIONS_STATUS.dismissed;
          }
          return PERMISSIONS_STATUS.denied;
        }

        return PERMISSIONS_STATUS.denied;
      });
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
