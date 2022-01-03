import { NativeBridge } from '../lib/nativeBridge';
import { log } from '../lib/logging';
import { memoize } from 'underscore';

const BRIDGE_NAME = 'settings';
const BRIDGE_METHODS = {};
export const BRIDGE_EVENTS = {};

class NativeSettingsService extends NativeBridge {
  constructor() {
    super(
      BRIDGE_NAME,
      BRIDGE_EVENTS,
      BRIDGE_METHODS
    );
  }

  get isFeedbackSoundEnabled() {
    const isFeedbackSoundEnabled = memoize(() => {
      const dataStatic = this.getStatic();

      log('nativeSettingsService#isFeedbackSoundEnabled');

      return dataStatic.user_settings.feedback_sound_enabled;
    });

    return isFeedbackSoundEnabled();
  }
}

export default new NativeSettingsService();
