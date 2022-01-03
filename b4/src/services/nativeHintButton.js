import { NativeBridge } from '../lib/nativeBridge';
import { log } from '../lib/logging';

const BRIDGE_NAME = 'hintButton';
const BRIDGE_METHODS = {
  SHOW: 'SHOW',
  HIDE: 'HIDE'
};
export const BRIDGE_EVENTS = {
  ON_CLICK: 'onClick'
};

class NativeHintButton extends NativeBridge {
  constructor() {
    super(
      BRIDGE_NAME,
      BRIDGE_EVENTS,
      BRIDGE_METHODS
    );
  }

  show(type) {
    log('nativeHintButton#show');
    this.postMessage(BRIDGE_METHODS.SHOW, { type });
  }

  hide() {
    log('nativeHintButton#hide');
    this.postMessage(BRIDGE_METHODS.HIDE);
  }
}

export default new NativeHintButton();
