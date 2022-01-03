
import nativeHintButton, { BRIDGE_EVENTS } from '../../src/services/nativeHintButton';
import { setupMethodMock, setupEventMock } from '../lib/nativeBridgeTestHelpers';

describe('NativeHintButton bridge', () => {
  const name = 'hintButton';

  describe('the bridge', () => {
    it(`is called '${name}'`, () => {
      expect(nativeHintButton.name).toEqual(name);
    });
  });

  describe('the interface with native', () => {
    describe('methods that trigger the execution of native iOS code', () => {
      const getMessage = setupMethodMock();

      describe('web calls show()', () => {
        it('should post a message to native', () => {
          const expectedMessage = {
            type: 'hintButton/SHOW',
            payload: {
              type: 'HINT'
            }
          };

          nativeHintButton.show('HINT');
          expect(getMessage()).toEqual(expectedMessage);
        });
      });

      describe('web calls hide()', () => {
        it('should post a message to native', () => {
          const expectedMessage = {
            type: 'hintButton/HIDE',
            payload: {}
          };

          nativeHintButton.hide();
          expect(getMessage()).toEqual(expectedMessage);
        });
      });
    });

    describe('messages from the native iOS application to the lesson-player', () => {
      describe('when native calls onClick', () => {
        const getEvent = setupEventMock(nativeHintButton, BRIDGE_EVENTS.ON_CLICK);

        it('should dispatch an onClick event', () => {
          window.babbelWeb.hintButton.onClick({ type: 'HINT' });
          const event = getEvent();
          expect(event.detail).toEqual({ type: 'HINT' });
        });
      });
    });
  });
});
