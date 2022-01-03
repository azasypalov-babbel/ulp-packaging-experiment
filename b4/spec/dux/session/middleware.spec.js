import { INIT_MIC_SETTINGS, SET_MIC_SETTINGS } from '../../../src/dux/session/types';
import sessionMiddleware from '../../../src/dux/session/middleware';

import { isWebview } from '../../../src/lib/features';
import cookies from '../../../src/lib/cookies';
import { postNativeMessage } from '../../../src/lib/nativeBridge';

jest.mock('../../../src/lib/features');
jest.mock('../../../src/lib/cookies', () => ({
  setCookie: jest.fn(),
  getCookie: jest.fn()
}));
jest.mock('../../../src/lib/nativeBridge');

const create = (state) => {
  const store = {
    getState: jest.fn(() => state),
    dispatch: jest.fn()
  };

  const next = jest.fn();

  const invoke = (action) => sessionMiddleware(store)(next)(action);

  return { store, next, invoke };
};

const defaultState = {
  micSettings: {
    isMicEnabled: null
  }
};

describe('Session Middleware', () => {
  describe('for a INIT_MIC_SETTINGS action', () => {
    const action = { type: INIT_MIC_SETTINGS, payload: { isMicEnabled: null } };

    it('passes through the action', () => {
      const { next, invoke } = create(defaultState);
      invoke(action);
      expect(next).toHaveBeenCalledWith(action);
    });

    describe('when NOT in Webview', () => {
      beforeEach(() => {
        isWebview.mockImplementationOnce(() => false);
      });

      test('should get cookies with speak settings', () => {
        const { invoke } = create(defaultState);
        invoke(action);

        expect(cookies.getCookie).toHaveBeenCalledWith('setting_speak');
      });

      describe('when cookies are empty', () => {
        test('should modify action payload with true', () => {
          cookies.getCookie.mockImplementationOnce(() => null);
          const { next, invoke } = create(defaultState);
          invoke(action);

          expect(next).toHaveBeenCalledWith({
            type: INIT_MIC_SETTINGS,
            payload: {
              isMicEnabled: true
            }
          });
        });
      });

      describe('when cookies contains speak enabled', () => {
        test('should modify action payload with true', () => {
          cookies.getCookie.mockImplementationOnce(() => 'enableSpeak');
          const { invoke, next } = create(defaultState);
          invoke(action);

          expect(next).toHaveBeenCalledWith({
            type: INIT_MIC_SETTINGS,
            payload: {
              isMicEnabled: true
            }
          });
        });
      });

      describe('when cookies containts speak disabled', () => {
        test('should modify action payload with false', () => {
          cookies.getCookie.mockImplementationOnce(() => 'disableSpeak');
          const { invoke, next } = create(defaultState);
          invoke(action);

          expect(next).toHaveBeenCalledWith({
            type: INIT_MIC_SETTINGS,
            payload: {
              isMicEnabled: false
            }
          });
        });
      });
    });

    describe('when in Webview', () => {
      const spy = jest.fn();
      Object.defineProperty(global.document, 'querySelector', { value: spy });

      beforeEach(() => {
        isWebview.mockImplementationOnce(() => true);
      });

      test('should query the DOM for the data-static element', () => {
        spy.mockImplementation(() => ({ text: '{ "initial_mic_enabled": true }' }));
        const { invoke } = create(defaultState);
        invoke(action);

        expect(spy).toHaveBeenCalledWith('script[data-static]');
      });

      describe('when data-static contains initial mic enabled true', () => {
        test('should modify action payload with true', () => {
          spy.mockImplementation(() => ({ text: '{ "initial_mic_enabled": true }' }));
          const { invoke, next } = create(defaultState);
          invoke(action);

          expect(next).toHaveBeenCalledWith({
            type: INIT_MIC_SETTINGS,
            payload: {
              isMicEnabled: true
            }
          });
        });
      });

      describe('when data-static contains initial mic enabled false', () => {
        test('should modify action payload with false', () => {
          spy.mockImplementation(() => ({ text: '{ "initial_mic_enabled": false }' }));
          const { invoke, next } = create(defaultState);
          invoke(action);

          expect(next).toHaveBeenCalledWith({
            type: INIT_MIC_SETTINGS,
            payload: {
              isMicEnabled: false
            }
          });
        });
      });
    });
  });

  describe('for a SET_MIC_SETTINGS action', () => {
    const action = { type: SET_MIC_SETTINGS, payload: { isMicEnabled: true } };

    it('passes through the action', () => {
      const { next, invoke } = create(defaultState);
      invoke(action);
      expect(next).toHaveBeenCalledWith(action);
    });

    describe('when NOT in Webview', () => {
      beforeEach(() => {
        isWebview.mockImplementationOnce(() => false);
      });

      test('should set cookies with speak settings', () => {
        const { invoke } = create(defaultState);
        invoke(action);
        const cookieSpy = jest.spyOn(cookies, 'setCookie');
        const [cookieName, cookieValue] = cookieSpy.mock.calls[0];

        expect(cookieName).toBe('setting_speak');
        expect(cookieValue).toBe('enableSpeak');
      });
    });

    describe('when in Webview', () => {
      beforeEach(() => {
        isWebview.mockImplementationOnce(() => true);
      });

      test('should post a native message with speak settings', () => {
        const { invoke } = create(defaultState);
        invoke(action);

        expect(postNativeMessage).toHaveBeenCalledWith({
          type: 'SPEECH_UPDATE_MIC_SETTINGS',
          payload: { enabled: true }
        });
      });
    });
  });
});
