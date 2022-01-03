const realSoundService = jest.requireActual('../soundService');
export const PlayStates = realSoundService.PlayStates;
export const checks = realSoundService.checks;

const mockInstances = new Map();

const createMockSoundController = jest.fn((url) => {
  const mockListeners = new Set();
  let playState = PlayStates.INITIAL;
  const controller = {
    getPlaybackRate: jest.fn(() => 1.0),
    getState: jest.fn(() => playState),
    getDuration: jest.fn(() => 0.0),
    load: jest.fn(() => Promise.resolve()),
    cleanup: jest.fn(),
    play: jest.fn(),
    pause: jest.fn(),
    stop: jest.fn(),
    reset: jest.fn(() => {
      playState = PlayStates.INITIAL;
    }),
    subscribe: jest.fn((listener) => {
      mockListeners.add(listener);
      return () => {
        mockListeners.delete(listener);
      };
    }),
    // Mock specific helper methods
    simulate: (topic, msg) => {
      const stateMap = {
        playinitiated: PlayStates.INITIATED,
        play: PlayStates.PLAYING,
        pause: PlayStates.PAUSED,
        stop: PlayStates.STOPPED,
        end: PlayStates.COMPLETED,
        playerror: PlayStates.FAILED
      };
      if (stateMap[topic]) {
        playState = stateMap[topic];
      }
      mockListeners.forEach((listener) => listener({ event: topic, msg }));
    }
  };

  mockInstances.set(url, controller);

  return controller;
});

const mockSoundService = {
  preload: jest.fn((url) => {
    if (!mockInstances.has(url)) createMockSoundController(url);
  }),
  subscribe: jest.fn(),
  stop: jest.fn(),
  play: jest.fn(),
  isPlaying: jest.fn(
    (instance) => [PlayStates.INITIATED, PlayStates.PLAYING].includes(instance.getState())
  ),
  hasPlayed: jest.fn(
    (instance) => ![
      PlayStates.INITIATED,
      PlayStates.PLAYING,
      PlayStates.STOPPED
    ].includes(instance.getState())
  ),
  getPlayingInstances: jest.fn(() => []),
  getInstance: jest.fn((url) => {
    mockSoundService.preload(url);
    return mockInstances.get(url);
  })
};

afterEach(() => {
  mockInstances.clear();
});

export default mockSoundService;
