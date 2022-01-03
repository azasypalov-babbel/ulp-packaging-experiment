import AbstractPermissionsService from './abstract';
import { NativeBridge } from '../../lib/nativeBridge';

const BRIDGE_NAME = 'speech';
const BRIDGE_METHODS = {
  SPEECH_REQUEST_PERMISSIONS: 'SPEECH_REQUEST_PERMISSIONS'
};
export const BRIDGE_EVENTS = {
  ON_REQUEST_PERMISSIONS_FINISH: 'onRequestPermissionsFinish'
};
export class PermissionsService extends AbstractPermissionsService {
  constructor() {
    super();
    this.bridge = new NativeBridge(BRIDGE_NAME, BRIDGE_EVENTS, BRIDGE_METHODS);
  }
  init() {
    return new Promise((resolve, reject) => {
      try {
        const configElement = document.querySelector('script[data-static]');
        const { initial_mic_permissions: initialMicPermission } = JSON.parse(configElement.text);

        let subscribe = (handler) => {
          this.bridge.addEventListener(
            BRIDGE_EVENTS.ON_REQUEST_PERMISSIONS_FINISH,
            ({ detail }) => handler(detail.micPermissions)
          );
        };

        resolve({
          status: initialMicPermission,
          subscribe
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  prompt() {
    return new Promise((resolve) => {
      const handleRequestFinish = ({ detail }) => {
        resolve(detail.micPermissions);
        this.bridge.removeEventListener(BRIDGE_EVENTS.ON_REQUEST_PERMISSIONS_FINISH, handleRequestFinish);
      };

      this.bridge.addEventListener(
        BRIDGE_EVENTS.ON_REQUEST_PERMISSIONS_FINISH,
        handleRequestFinish
      );

      this.bridge.postMessage(BRIDGE_METHODS.SPEECH_REQUEST_PERMISSIONS);
    });
  }

 /**
  * When microphone permission was denied, learners may be reminded to re-engage with permissions.
  * To enable that, this method returns true.
  */
  resetOnDeniedPermission() {
    return true;
  }
}

export default new PermissionsService();
