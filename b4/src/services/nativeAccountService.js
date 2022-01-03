import { NativeBridge } from '../lib/nativeBridge';
import { log } from '../lib/logging';

const BRIDGE_NAME = 'account';
const BRIDGE_METHODS = {};
export const BRIDGE_EVENTS = {};

class NativeAccountService extends NativeBridge {
  constructor() {
    super(
      BRIDGE_NAME,
      BRIDGE_EVENTS,
      BRIDGE_METHODS
    );
  }

  fetchAccount() {
    const { account } = this.getStatic();

    log('nativeAccountService#fetchAccount');

    return Promise.resolve(account);
  }
}

export default new NativeAccountService();
