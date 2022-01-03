import { NativeBridge } from '../lib/nativeBridge';
import { log } from '../lib/logging';

const BRIDGE_NAME = 'abtester';
const BRIDGE_METHODS = {};
export const BRIDGE_EVENTS = {};

class NativeAbTesterService extends NativeBridge {
  constructor() {
    super(
      BRIDGE_NAME,
      BRIDGE_EVENTS,
      BRIDGE_METHODS
    );
  }

  getExperimentBucket() {
    log('nativeAbTesterService#getExperimentBucket, not implemented');
    return Promise.resolve();
  }
}

export default new NativeAbTesterService();
