import { createSoundService, PlayStates } from '../../src/services/soundService';
import { Howl } from 'howler';
import rollbarService from '../../src/services/rollbarService';

jest.mock('howler');
jest.mock('../../src/services/rollbarService', () => ({
  warning: jest.fn()
}));

describe('Sound Service', () => {
  let soundService = null;

  beforeAll(() => {
    jest.useFakeTimers();
  });
  beforeEach(() => {
    soundService = createSoundService();
  });

  const simulateEvent = (simulateTopic) => {
    const [howl] = Howl.mock.instances;
    const [, listener] = howl.on.mock.calls
      .find(([topic]) => topic === simulateTopic);

    listener();
  };

  describe('playing a sound', () => {
    test('a howl is constructed and played', () => {
      const instance = soundService.getInstance('some-sound.mp3');

      instance.play();

      expect(Howl).toHaveBeenCalledWith(expect.objectContaining({ src: 'some-sound.mp3' }));

      const [howl] = Howl.mock.instances;

      expect(howl.play).toHaveBeenCalledTimes(1);
    });

    test('howl is initialized with additional provided data', () => {
      const obj = { src: 'some-sound.mp3', format: 'aac' };
      const instance = soundService.getInstance(obj);
      instance.play();
      expect(Howl).toHaveBeenCalledWith(expect.objectContaining(obj));
      const [howl] = Howl.mock.instances;
      expect(howl.play).toHaveBeenCalledTimes(1);
    });

    test('should interrupt currently playing sounds', () => {
      const instanceA = soundService.getInstance('some-sound-a.mp3');
      const instanceB = soundService.getInstance('some-sound-b.mp3');

      instanceA.play();

      instanceB.play({ stopOtherSounds: true });

      const [howlA, howlB] = Howl.mock.instances;

      expect(howlA.stop).toHaveBeenCalled();
      expect(howlB.stop).not.toHaveBeenCalled();
    });
  });

  describe('global event subscriptions', () => {
    it('emits playinitiated event', () => {
      const eventHandler = jest.fn();

      soundService.subscribe(eventHandler);
      const instance = soundService.getInstance('some-sound.mp3');

      instance.play('some-sound.mp3');

      expect(eventHandler).toHaveBeenCalledWith(
        instance,
        expect.objectContaining({ event: 'playinitiated' }),
        undefined
      );
    });

    it('emits play event', () => {
      const eventHandler = jest.fn();

      soundService.subscribe(eventHandler);
      const instance = soundService.getInstance('some-sound.mp3');

      instance.play('some-sound.mp3');

      simulateEvent('play');

      expect(eventHandler).toHaveBeenCalledWith(
        instance,
        expect.objectContaining({ event: 'play' }),
        undefined
      );
    });

    it('emits stop event', () => {
      const eventHandler = jest.fn();

      soundService.subscribe(eventHandler);
      const instance = soundService.getInstance('some-sound.mp3');

      instance.play('some-sound.mp3');

      simulateEvent('play');
      simulateEvent('stop');

      expect(eventHandler).toHaveBeenCalledWith(
        instance,
        expect.objectContaining({ event: 'stop' }),
        undefined
      );
    });

    it('emits pause event', () => {
      const eventHandler = jest.fn();

      soundService.subscribe(eventHandler);
      const instance = soundService.getInstance('some-sound.mp3');

      instance.play('some-sound.mp3');

      simulateEvent('play');
      simulateEvent('pause');

      expect(eventHandler).toHaveBeenCalledWith(
        instance,
        expect.objectContaining({ event: 'pause' }),
        undefined
      );
    });

    it('emits end event', () => {
      const eventHandler = jest.fn();

      soundService.subscribe(eventHandler);
      const instance = soundService.getInstance('some-sound.mp3');

      instance.play('some-sound.mp3');

      simulateEvent('play');
      simulateEvent('end');

      expect(eventHandler).toHaveBeenCalledWith(
        instance,
        expect.objectContaining({ event: 'end' }),
        undefined
      );
    });
  });

  describe('event subscriptions', () => {
    let instance = null;
    let eventHandler = null;

    beforeEach(() => {
      eventHandler = jest.fn();
      instance = soundService.getInstance('some-sound.mp3');
      instance.subscribe(eventHandler);
      instance.play();
      eventHandler.mockClear();
    });

    test.each(['play', 'playerror'])('%s event notifies subscribers with corresponding value', (event) => {
      simulateEvent(event);

      expect(eventHandler).toHaveBeenCalledTimes(1);
      expect(eventHandler).toHaveBeenCalledWith(expect.objectContaining({ event }));
    });

    test('loaderror unloads sound instance', () => {
      simulateEvent('loaderror');

      const [howl] = Howl.mock.instances;

      expect(howl.unload).toHaveBeenCalledTimes(1);
    });

    describe('after playback has successfully started', () => {
      beforeEach(() => {
        simulateEvent('play');
        eventHandler.mockReset();
      });
      test('end event calls onEnd callback', () => {
        simulateEvent('end');
        expect(eventHandler).toHaveBeenCalledTimes(1);
        expect(eventHandler).toHaveBeenCalledWith(expect.objectContaining({ event: 'end' }));
      });

      test('pause event calls onPause callback', () => {
        simulateEvent('pause');
        expect(eventHandler).toHaveBeenCalledTimes(1);
        expect(eventHandler).toHaveBeenCalledWith(expect.objectContaining({ event: 'pause' }));
      });

      test('stop event calls onPause callback', () => {
        simulateEvent('stop');
        expect(eventHandler).toHaveBeenCalledTimes(1);
        expect(eventHandler).toHaveBeenCalledWith(expect.objectContaining({ event: 'stop' }));
      });
    });
  });

  describe('freeze logging', () => {
    test('logs a warning to rollbar on a play freeze', () => {
      const instance = soundService.getInstance('audio.mp3');
      instance.play({ skipOnFreeze: true });
      expect(instance.getState()).toBe(PlayStates.INITIATED);
      expect(rollbarService.warning).not.toBeCalled();
      jest.runAllTimers();
      expect(instance.getState()).toBe(PlayStates.FAILED);
      expect(rollbarService.warning).toBeCalled();
    });

    test('doesnt log a warning if state changes', () => {
      const instance = soundService.getInstance('audio.mp3');
      instance.play({ skipOnFreeze: true });
      simulateEvent('play');
      jest.runAllTimers();
      expect(rollbarService.warning).not.toBeCalled();
      expect(instance.getState()).toBe(PlayStates.PLAYING);
    });
  });

  describe('playbackRate', () => {
    test('is not set no rate is provided', () => {
      const playbackRate = 1;
      const instance = soundService.getInstance('some-sound.mp3');

      instance.play();

      const [howl] = Howl.mock.instances;

      expect(howl.rate).not.toHaveBeenCalledWith(playbackRate);
      expect(howl.play).toHaveBeenCalledTimes(1);
    });

    test('is set from argument', () => {
      const playbackRate = 0.7;
      const instance = soundService.getInstance('some-sound.mp3');

      instance.play({ playbackRate });

      const [howl] = Howl.mock.instances;

      expect(howl.rate).toHaveBeenCalledWith(playbackRate);
      expect(howl.play).toHaveBeenCalledTimes(1);
    });
  });
});
