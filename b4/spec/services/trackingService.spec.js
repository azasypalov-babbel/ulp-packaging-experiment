import trackingService from '../../src/services/trackingService';
import babbelTracker from '@lessonnine/tracker.js/dist/tracker.js';

const mockedTrack = jest.fn();

jest.mock('@lessonnine/tracker.js/dist/tracker.js', () => ({
  Tracker: jest.fn(() => ({ track: mockedTrack }))
}));

describe('trackingService', () => {
  describe('#track', () => {
    test('should envoke @lessonnine/tracker.js', () => {
      trackingService.track('name', 1, { foo: 'bar' });

      expect(babbelTracker.Tracker).toHaveBeenCalledWith({
        url: 'https://api.babbel-staging.io/gamma/v1/events',
        trackingUuidName: 'babbeltrackinguuid',
        userUuid: 'YOUR_UUID',
        useFetch: false
      });
    });

    test('returns a Promise', () => {
      const result = trackingService.track('name', 1, {});
      expect(typeof result.then).toBe('function');
    });
  });

  describe('#enhanced error information', () => {
    describe('rejects on failure', () => {
      beforeEach(() => {
        mockedTrack.mockImplementationOnce(({ error }) => {
          return error(new Error('Original Error'));
        });
      });

      test('with an instance of Error', async () => {
        await expect(trackingService.track('name', 1, { foo: 'bar' })).rejects.toEqual(expect.any(Error));
      });


      describe('with information about the tracking event', () => {
        test('in the error props', async () => {
          await expect(trackingService.track('name', 1, { foo: 'bar' })).rejects.toEqual(expect.objectContaining({
            trackingEvent: { name: 'name', version: 1 },
            originalError: expect.any(Error)
          }));
        });
        test('in the error message', async () => {
          await expect(trackingService.track('name', 1, { foo: 'bar' })).rejects.toEqual(expect.objectContaining({
            message: expect.stringContaining('event: name v1')
          }));
        });
      });
    });
  });
});
