import { EventTarget } from 'event-target-shim';
import { log } from './logging';

const postMessage = (message) => {
  window.webkit?.messageHandlers?.iosListener?.postMessage(message);
  window.androidListener?.postMessage(message);
};

export const isBridgeWorking = () => {
  return Boolean(window.webkit?.messageHandlers?.iosListener?.postMessage || window.androidListener?.postMessage);
};

/**
 * @deprecated please create a dedicated native bridge for communication with android and iOS
 */
export const postNativeMessage = (message) => {
  if (!isBridgeWorking()) {
    console.warn(`[NativeBridge] postMessage not available`, message);
    return;
  }

  log(`posting message ${JSON.stringify(message)} to native`);

  postMessage(JSON.stringify(message));
};

export const noOp = (command, name) => {
  return () => {
    log(`window.babbelWeb.${name}.${command}() was called, but there are no handlers registered.`);
  };
};

export const BABBEL_ROOT_BRIDGE = 'babbelWeb';

export class NativeBridge extends EventTarget {
  constructor(name, events, methods) {
    super();
    this.name = name;
    this.events = Object.values(events);
    this.methods = Object.values(methods);

    window[BABBEL_ROOT_BRIDGE] = window[BABBEL_ROOT_BRIDGE] || {};
    window[BABBEL_ROOT_BRIDGE][name] = window[BABBEL_ROOT_BRIDGE][name] || {};

    this.events.forEach((event) => {
      if (typeof window[BABBEL_ROOT_BRIDGE][this.name][event] === 'function') {
        console.warn(`Native bridge handler for ${BABBEL_ROOT_BRIDGE}.${this.name}.${event} already exists`);
      }
      window[BABBEL_ROOT_BRIDGE][this.name][event] = (payload) => {
        log(`nativeBridge: registering ${BABBEL_ROOT_BRIDGE}.${this.name}.${event}`);
        this.dispatchEvent(new CustomEvent(event, { detail: payload }));
      };
    });
  }

  getStatic() {
    const dataStaticElement = document.querySelector('script[data-static]');
    const dataStatic = JSON.parse(dataStaticElement.text);

    return dataStatic;
  }

  postMessage(type, payload = {}) {
    if (!this.methods.includes(type)) {
      throw new Error(`Message type ${type} not implemented for ${this.name}`);
    }

    const message = {
      type: `${this.name}/${type}`,
      payload
    };

    if (!isBridgeWorking()) {
      console.warn(`[NativeBridge] postMessage not available`, message);
      return;
    }

    log(`posting message ${JSON.stringify(message)} to native`);

    postMessage(JSON.stringify(message));
  }
}
