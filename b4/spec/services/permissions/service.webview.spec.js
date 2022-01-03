import permissionsService from '../../../src/services/permissions/service.webview';
import { PERMISSIONS_STATUS } from '../../../src/services/permissions/constants';

const initBridge = () => {
  window.webkit = window.webkit || {};
  window.webkit.messageHandlers = window.webkit.messageHandlers || {};
  window.webkit.messageHandlers.iosListener = window.webkit.messageHandlers.iosListener || {};
  window.webkit.messageHandlers.iosListener.postMessage = (
    typeof window.webkit.messageHandlers.iosListener.postMessage === 'function'
      ? window.webkit.messageHandlers.iosListener.postMessage
      : jest.fn()
  );
};

describe('Webview Permissions Service', () => {
  beforeAll(() => {
    initBridge();
    jest.spyOn(document, 'querySelector').mockImplementation(() => ({ text: '{}' }));
  });

  describe(`init`, () => {
    describe(`with initial permission`, () => {
      const STATE_FIXTURE = PERMISSIONS_STATUS.granted;

      beforeEach(() => {
        document.querySelector.mockReturnValue({
          text: JSON.stringify({
            initial_mic_permissions: STATE_FIXTURE
          })
        });
      });

      test('resolves status with state', () => {
        return expect(permissionsService.init()).resolves.toEqual(
          expect.objectContaining({
            status: STATE_FIXTURE,
            subscribe: expect.any(Function)
          })
        );
      });
    });
  });
});
