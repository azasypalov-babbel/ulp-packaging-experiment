import { NativeBridge } from '../lib/nativeBridge';
import camelize from 'camelize';
import * as features from '../lib/features';
import { log } from '../lib/logging';

const BRIDGE_NAME = 'content';
const BRIDGE_METHODS = {};
export const BRIDGE_EVENTS = {};

class NativeContentService extends NativeBridge {
  constructor() {
    super(
      BRIDGE_NAME,
      BRIDGE_EVENTS,
      BRIDGE_METHODS
    );
  }

  fetchLearnLanguage() {
    const dataStatic = this.getStatic();
    const response = {
      ...camelize(dataStatic.learn_language),
      unlocked: features.get('is_unlocked')
    };

    log('nativeContentService#fetchLearnLanguage', response);

    return Promise.resolve(response);
  }
}

export default new NativeContentService();
