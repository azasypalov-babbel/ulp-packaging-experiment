/* eslint-disable camelcase */
import nativeTrackingService from '../../src/services/nativeTrackingService';
import { setupMethodMock } from '../lib/nativeBridgeTestHelpers';

describe('nativeTrackingService', () => {
  const name = 'tracking';
  describe('the bridge', () => {
    it(`is called '${name}'`, () => {
      expect(nativeTrackingService.name).toEqual(name);
    });
  });

  describe('#track', () => {
    const getMessage = setupMethodMock();

    test('should send message over bridge', () => {
      nativeTrackingService.track(
        'some_event',
        1,
        { lesson_id: '891237yh', completed: true }
      );

      expect(getMessage()).toEqual({
        type: 'tracking/TRACK',
        payload: {
          name: 'some_event',
          version: 1,
          event_payload: {
            lesson_id: '891237yh',
            completed: true
          }
        }
      });
    });

    test('returns a Promise', () => {
      const result = nativeTrackingService.track('name', 1, {});
      expect(typeof result.then).toBe('function');
    });
  });
});
