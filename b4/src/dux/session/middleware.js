import * as types from './types';

import * as features from '../../lib/features';
import { postNativeMessage } from '../../lib/nativeBridge';
import cookies from '../../lib/cookies';

const session = () => (next) => (action) => {
  if (action.type === types.INIT_MIC_SETTINGS) {
    let isMicEnabled = true;

    if (features.isWebview()) {
      const configElement = document.querySelector('script[data-static]');
      isMicEnabled = JSON.parse(configElement.text).initial_mic_enabled;
    } else {
      const cookie = cookies.getCookie('setting_speak');
      if (cookie === 'disableSpeak') {
        isMicEnabled = false;
      }
    }

    action.payload.isMicEnabled = isMicEnabled;
  }

  if (action.type === types.SET_MIC_SETTINGS) {
    const { isMicEnabled } = action.payload;

    if (features.isWebview()) {
      const message = {
        type: 'SPEECH_UPDATE_MIC_SETTINGS',
        payload: { enabled: isMicEnabled }
      };

      postNativeMessage(message);
    } else {
      const cookieExpirationDate = new Date();
      cookieExpirationDate.setDate(cookieExpirationDate.getDate() + 365);
      cookies.setCookie('setting_speak', isMicEnabled ? 'enableSpeak' : 'disableSpeak', cookieExpirationDate);
    }
  }

  return next(action);
};

export default session;
