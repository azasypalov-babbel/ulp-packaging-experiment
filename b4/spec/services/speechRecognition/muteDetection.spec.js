import { startMuteDetection } from '../../../src/services/speechRecognition/muteDetection';

describe('Speech Recognition Mute Detection', () => {
  const getUserMediaMock = jest.fn(() => Promise.resolve());

  Object.defineProperty(global.navigator, 'mediaDevices', {
    value: {
      getUserMedia: getUserMediaMock
    }
  });

  global.AudioContext = jest.fn(() => ({ createMediaStreamSource: jest.fn() }));

  const mockMediaTrack = {
    muted: false,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    stop: jest.fn()
  };

  const mockStream = {
    getTracks: jest.fn(() => [mockMediaTrack]),
    getAudioTracks: jest.fn(() => [mockMediaTrack])
  };

  getUserMediaMock.mockImplementation(() => Promise.resolve(mockStream));

  const onChangeMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when mute detection is started', () => {
    it('should open a media stream', () => {
      return startMuteDetection({ onChange: onChangeMock }).then(() => {
        expect(global.navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ audio: true });
      });
    });

    describe('when mic is unmuted', () => {
      beforeEach(() => {
        mockMediaTrack.muted = false;
      });

      it('should call change callback with muted false', () => {
        return startMuteDetection({
          onChange: onChangeMock
        }).then(() => {
          expect(onChangeMock).toHaveBeenCalledWith({
            target: expect.objectContaining({ muted: false })
          });
        });
      });
    });

    describe('when mic is muted', () => {
      beforeEach(() => {
        mockMediaTrack.muted = true;
      });

      it('should call change callback with muted true', () => {
        return startMuteDetection({
          onChange: onChangeMock
        }).then(() => {
          expect(onChangeMock).toHaveBeenCalledWith({
            target: expect.objectContaining({ muted: true })
          });
        });
      });
    });

    it('should addEventListeners for mute/unmute', () => {
      return startMuteDetection({
        onChange: onChangeMock
      }).then(() => {
        expect(mockMediaTrack.addEventListener.mock.calls[0]).toEqual([
          'mute',
          onChangeMock
        ]);
        expect(mockMediaTrack.addEventListener.mock.calls[1]).toEqual([
          'unmute',
          onChangeMock
        ]);
      });
    });
  });
  describe('when mute detection is cleaned up', () => {
    it('should cleanup open media stream', () => {
      return startMuteDetection({ onChange: onChangeMock })
        .then((cleanupMuteDetection) => cleanupMuteDetection())
        .then(() => {
          expect(mockMediaTrack.stop).toHaveBeenCalled();
        });
    });
    it('should removeEventListeners for mute/unmute', () => {
      return startMuteDetection({ onChange: onChangeMock })
        .then((cleanupMuteDetection) => cleanupMuteDetection())
        .then(() => {
          expect(mockMediaTrack.removeEventListener.mock.calls[0]).toEqual([
            'mute',
            onChangeMock
          ]);
          expect(mockMediaTrack.removeEventListener.mock.calls[1]).toEqual([
            'unmute',
            onChangeMock
          ]);
        });
    });
  });
});
