/* eslint-disable camelcase */
import NativeRollbarProxyBridge, { BRIDGE_METHODS, BRIDGE_NAME } from '../../src/services/nativeRollbarProxyBridge';
import { setupMethodMock } from '../lib/nativeBridgeTestHelpers';

describe('nativeRollbarProxyBridge', () => {
  const RollbarProxy = new NativeRollbarProxyBridge();

  describe('the bridge', () => {
    it(`is called '${BRIDGE_NAME}'`, () => {
      expect(RollbarProxy.name).toEqual(BRIDGE_NAME);
    });

    it('adds the proxy to the window', () => {
      expect(window.RollbarProxy).toBeTruthy();
    });
  });

  describe('RollbarProxy', () => {
    const getMessage = setupMethodMock();

    test('sendJsonPayload should send message over bridge', () => {
      const mockJson = 'mock';
      const mockSuccess = jest.fn();

      const proxy = new window.RollbarProxy();
      proxy.sendJsonPayload(mockJson, mockSuccess);

      expect(getMessage()).toEqual({
        type: `${BRIDGE_NAME}/${BRIDGE_METHODS.sendJsonPayload}`,
        payload: { payload: mockJson }
      });

      expect(mockSuccess).toHaveBeenCalled();
    });
  });
});
