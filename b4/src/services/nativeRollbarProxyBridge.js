import { NativeBridge } from '../lib/nativeBridge';

export const BRIDGE_NAME = 'rollbar';
export const BRIDGE_METHODS = {
  sendJsonPayload: 'SEND_JSON_PAYLOAD'
};
export const BRIDGE_EVENTS = {};

class NativeRollbarProxyBridge extends NativeBridge {
  constructor() {
    super(
      BRIDGE_NAME,
      BRIDGE_EVENTS,
      BRIDGE_METHODS
    );

    // implemention referenced in docs: https://docs.rollbar.com/docs/json-proxy#rollbarproxy-browser-js-only
    const RollbarProxy = function() {};
    RollbarProxy.prototype.sendJsonPayload = (function(json, success) {
      this.postMessage(BRIDGE_METHODS.sendJsonPayload, { payload: json });
      success();
    }).bind(this);

    window.RollbarProxy = RollbarProxy;
  }
}

export default NativeRollbarProxyBridge;
