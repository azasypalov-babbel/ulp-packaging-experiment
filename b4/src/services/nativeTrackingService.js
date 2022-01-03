import { NativeBridge } from '../lib/nativeBridge';

const BRIDGE_NAME = 'tracking';
const BRIDGE_METHODS = {
  TRACK: 'TRACK'
};
export const BRIDGE_EVENTS = {};

class NativeTrackingService extends NativeBridge {
  constructor() {
    super(
      BRIDGE_NAME,
      BRIDGE_EVENTS,
      BRIDGE_METHODS
    );
  }

  track(name, version, payload = {}) {
    this.postMessage(BRIDGE_METHODS.TRACK, {
      name,
      version,
      // eslint-disable-next-line camelcase
      event_payload: payload
    });

    return Promise.resolve();
  }
}

export default new NativeTrackingService();
