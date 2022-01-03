import recordingService from '../../src/services/recordingService';

describe('recordingService', () => {
  const mockStart = jest.fn();
  const mockStop = jest.fn(function() {
    this.onstop();
  });
  const mockUrlValue = 'bloburl.mp3';
  const mockResolveValue = { src: mockUrlValue, format: 'ogg' };

  const mockMediaRecorderTrack = {
    stop: jest.fn()
  };

  beforeAll(() => {
    Object.defineProperty(global.navigator, 'mediaDevices', {
      value: {
        getUserMedia: jest.fn(() => Promise.resolve())
      }
    });

    global.URL = {
      createObjectURL: jest.fn(() => mockUrlValue)
    };

    global.MediaRecorder = jest.fn(() => ({
      start: mockStart,
      stop: mockStop,
      stream: {
        getTracks: jest.fn(() => [mockMediaRecorderTrack])
      }
    }));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('#start', () => {
    test('returns a Promise', () => {
      const result = recordingService.start();
      expect(typeof result.then).toBe('function');
    });

    test('calls mediaRecorder.start', () => {
      expect.assertions(1);

      // setup expectation
      const waitFor = recordingService.start()
        .then(() => {
          expect(mockStart).toHaveBeenCalled();
        });

      navigator.mediaDevices.getUserMedia.mock.results[0].value.then(() => {
        recordingService.stop();
      });

      return waitFor;
    });

    test('calls mediaRecord.stop before starting a new recording', () => {
      expect.assertions(1);

      // setup expectation
      const waitFor =  recordingService.start()
        .then(() => {
          expect(mockStop).toHaveBeenCalled();
        });

      navigator.mediaDevices.getUserMedia.mock.results[0].value.then(() => {
        recordingService.start();
      });

      return waitFor;
    });

    test('resolves when calling stop method', () => {
      expect.assertions(1);

      // setup expectation
      const waitFor = recordingService.start()
        .then((resolvedValue) => {
          expect(resolvedValue).toEqual(mockResolveValue);
        });

      navigator.mediaDevices.getUserMedia.mock.results[0].value.then(() => {
        recordingService.stop();
      });

      return waitFor;
    });
  });

  describe('#stop', () => {
    test('calls mediaRecorder.stop', () => {
      expect.assertions(1);

      // setup expectation
      const waitFor = recordingService.start()
        .then(() => {
          expect(mockStop).toHaveBeenCalled();
        });

      navigator.mediaDevices.getUserMedia.mock.results[0].value.then(() => {
        recordingService.stop();
      });

      return waitFor;
    });

    test('stops all tracks in stream', () => {
      expect.assertions(1);

      // setup expectation
      const waitFor = recordingService.start()
        .then(() => {
          expect(mockMediaRecorderTrack.stop).toHaveBeenCalled();
        });

      navigator.mediaDevices.getUserMedia.mock.results[0].value.then(() => {
        recordingService.stop();
      });

      return waitFor;
    });
  });
});
