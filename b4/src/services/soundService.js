import { Howl, Howler } from 'howler';
import rollbar from './rollbarService';

export const PlayStates = {
  FAILED: 'failed',
  STOPPED: 'stopped',
  INITIAL: 'initial',
  INITIATED: 'initiated',
  PLAYING: 'playing',
  PAUSED: 'paused',
  COMPLETED: 'completed'
};

export const checks = {
  isPlaying(playState, includingInitiated = true) {
    return [
      PlayStates.PLAYING,
      includingInitiated ? PlayStates.INITIATED : PlayStates.PLAYING
    ].includes(playState);
  },
  hasPlayed(playState, notPaused = false) {
    return !checks.isPlaying(playState) && ![
      PlayStates.INITIAL,
      notPaused ? PlayStates.PAUSED : PlayStates.INITIAL
    ].includes(playState);
  },
  hasFailed(playState) {
    return playState === PlayStates.FAILED;
  },
  isInterrupted(playState) {
    return checks.hasPlayed(playState) && playState !== PlayStates.COMPLETED;
  }
};

const getUrl = (soundData) => soundData?.src ? soundData.src : soundData;

export const createSoundService = () => {
  const createPubSub = () => {
    const listeners = [];
    return {
      subscribe(listener) {
        if (!listeners.includes(listener)) {
          listeners.push(listener);
        }
        return () => {
          const index = listeners.indexOf(listener);
          if (index !== -1) {
            listeners.splice(index, 1);
          }
        };
      },
      publish(...args) {
        listeners.forEach((listener) => listener(...args));
      },
      unsubscribe() {
        listeners.splice(0, listeners.length);
      }
    };
  };
  const instances = {};
  const globalPubSub = createPubSub();
  const createSoundController = (soundData, service) => {
    let playState = PlayStates.INITIAL;
    const url = getUrl(soundData);
    const howl = !url ? null : new Howl({
      src: url,
      html5: true,
      preload: true,
      ...(soundData && typeof soundData === 'object' ? soundData : {})
    });
    const pubSub = createPubSub();
    const createFreezeLogger = () => {
      let timers = {};
      const unsub = pubSub.subscribe(() => {
        const newState = playState;
        Object.entries(timers).forEach(([stateKey, timer]) => {
          if (newState !== stateKey) {
            clearTimeout(timer);
            delete timers[stateKey];
          }
        });
      });
      return {
        track({ fallbackState, publishEvent = 'playerror', timeout = 3000 }) {
          const currentPlayState = playState;
          clearTimeout(timers[currentPlayState]);
          timers[currentPlayState] = setTimeout(() => {
            rollbar.warning(`Sound has frozen and was skipped`, {
              url,
              state: currentPlayState,
              howlerState: howl.state()
            });
            playState = fallbackState;
            pubSub.publish({ event: publishEvent });
            delete timers[currentPlayState];
          }, timeout);
        },
        unwire() {
          unsub();
          Object.values(timers).forEach((timer) => {
            clearTimeout(timer);
          });
          timers = {};
        }
      }
    }
    const freezeLogger = createFreezeLogger();
    let loadingPromise = null;
    const unsubFromGlobal = pubSub.subscribe((topic, value) => {
      globalPubSub.publish(instances[url], topic, value);
    });
    const controller = {
      getPlaybackRate() {
        if (howl === null || ['unloaded', 'loading'].includes(howl.state())) return 1;
        return howl.rate();
      },
      getState() {
        return playState;
      },
      getDuration() {
        if (howl === null || ['unloaded', 'loading'].includes(howl.state())) return 0;
        return (howl.duration() * 1000) / controller.getPlaybackRate();
      },
      load(retries = 0) {
        if (loadingPromise === null) {
          loadingPromise = howl === null ? Promise.reject() : new Promise((resolve, reject) => {
            if (howl.state() !== 'loading') howl.load();
            howl.once('load', resolve);
            howl.once('loaderror', () => {
              if (retries === 0) {
                howl.unload();
                reject();
                loadingPromise = null;
              } else {
                controller.load(retries - 1).then(resolve, reject);
              }
            });
          });
        }
        return loadingPromise;
      },
      reset() {
        if (playState === PlayStates.PAUSED) howl?.seek(0);
        playState = PlayStates.INITIAL;
      },
      cleanup() {
        if (howl !== null) {
          howl.off('play');
          howl.off('end');
          howl.off('pause');
          howl.off('stop');
          howl.off('playerror');
          howl.off('loaderror');
        }
        loadingPromise = null;
        unsubFromGlobal();
        pubSub.unsubscribe();
        freezeLogger.unwire();
        playState = PlayStates.INITIAL;
        delete instances[url];
      },
      play({ reset = false, stopOtherSounds = true, playbackRate = null, skipOnFreeze = false } = {}) {
        if (howl === null) {
          // to update the state
          playState = PlayStates.INITIATED;
          pubSub.publish({ event: 'playinitiated' });
          setTimeout(() => {
            playState = PlayStates.FAILED;
            pubSub.publish({ event: 'playerror' });
          });
          return;
        }
        if (stopOtherSounds) service.stop({ exceptUrls: [url] });
        if (reset && playState !== PlayStates.INITIATED) howl.seek(0);
        if (reset || ![PlayStates.PLAYING, PlayStates.INITIATED].includes(playState)) {
          playState = PlayStates.INITIATED;
          pubSub.publish({ event: 'playinitiated' });
          if (skipOnFreeze) freezeLogger.track({ fallbackState: PlayStates.FAILED });
          if (playbackRate !== null) howl.rate(playbackRate);
          if (howl.state() === 'unloaded') {
            controller.load().finally(() => {
              if (playState === PlayStates.INITIATED) howl.play();
            });
          }
          else howl.play();
        }
      },
      pause() {
        if (howl !== null) howl.pause();
        else {
          setTimeout(() => {
            pubSub.publish({ event: 'playerror' });
          });
        }
      },
      stop() {
        if (howl !== null) howl.stop();
        else {
          setTimeout(() => {
            pubSub.publish({ event: 'playerror' });
          });
        }
      },
      unload() {
        howl?.unload();
      },
      subscribe: pubSub.subscribe
    };
    if (howl !== null) {
      howl.on('play', (_, msg) => {
        playState = PlayStates.PLAYING;
        pubSub.publish({ event: 'play', msg });
      });
      howl.on('pause', (_, msg) => {
        playState = PlayStates.PAUSED;
        pubSub.publish({ event: 'pause', msg });
      });
      howl.on('stop', (_, msg) => {
        if (playState !== PlayStates.INITIAL) playState = PlayStates.STOPPED;
        pubSub.publish({ event: 'stop', msg });
      });
      howl.on('end', (_, msg) => {
        playState = PlayStates.COMPLETED;
        pubSub.publish({ event: 'end', msg });
      });
      howl.on('loaderror', (_, msg) => {
        if (playState !== PlayStates.INITIAL) playState = PlayStates.FAILED;
        pubSub.publish({ event: 'loaderror', msg });
        loadingPromise = null;
        controller.unload();
      });
      howl.on('playerror', (_, msg) => {
        playState = PlayStates.FAILED;
        pubSub.publish({ event: 'playerror', msg });
      });
    }
    return controller;
  };
  const soundService = {
    preload: (soundData, { retriesOnFail = 0 } = {}) => {
      const url = getUrl(soundData);
      if (!instances[url]) {
        instances[url] = createSoundController(soundData, soundService);
      }
      instances[url].load(retriesOnFail).catch(() => {
        instances[url].unload();
      });
    },
    subscribe: globalPubSub.subscribe,
    play(url, options = {}) {
      const instance = soundService.getInstance(url);
      instance.play(options);
      return instance;
    },
    stop({ exceptUrls = [] } = {}) {
      Object.entries(instances).forEach(([url, instance]) => {
        if (!exceptUrls.includes(url) && soundService.isPlaying(instance)) {
          instance.stop();
        }
      });
    },
    isPlaying(soundDataOrInstance) {
      if (!soundDataOrInstance) return false;
      const url = getUrl(soundDataOrInstance);
      const instance = typeof url === 'string' ? instances[url] : soundDataOrInstance;
      return checks.isPlaying(instance.getState());
    },
    hasPlayed(urlOrInstance) {
      if (!urlOrInstance) return false;
      const url = getUrl(urlOrInstance);
      const instance = typeof url === 'string' ? instances[url] : urlOrInstance;
      return checks.hasPlayed(instance.getState());
    },
    getPlayingInstances() {
      return Object.values(instances).filter(soundService.isPlaying);
    },
    getInstance(soundData) {
      const url = getUrl(soundData);
      if (!instances[url]) soundService.preload(soundData);
      return instances[url];
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    // By setting volume & calling unlockAudio, howler will
    // try to unlock the audio permissions before any sounds are even loaded.
    Howler.volume();
    // eslint-disable-next-line no-underscore-dangle
    Howler._unlockAudio();
  });

  return soundService;
};

export default createSoundService();
