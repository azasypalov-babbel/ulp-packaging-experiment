import performAfterScroll from '../../src/lib/performAfterScroll';

let eventMap;
let realAddEventListener;
let realRemoveEventListener;

beforeEach(() => {
  realAddEventListener = window.addEventListener;
  realRemoveEventListener = window.removeEventListener;
  eventMap = {};

  window.addEventListener = jest.fn((eventName, callback) => {
    eventMap[eventName] = callback;
  });

  window.removeEventListener = jest.fn((eventName) => {
    delete eventMap[eventName];
  });
});

afterEach(() => {
  window.addEventListener = realAddEventListener;
  window.removeEventListener = realRemoveEventListener;
});

describe('performAfterScroll', () => {
  let mockCallback;
  let cleanup;

  beforeEach(() => {
    jest.useFakeTimers();

    mockCallback = jest.fn();
    cleanup = performAfterScroll(mockCallback);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('does not invoke the callback immediately', () => {
    expect(mockCallback).not.toHaveBeenCalled();
  });

  describe('when no scroll event occurs', () => {
    beforeEach(() => {
      jest.runAllTimers();
    });

    it('should invoke the callback', () => {
      expect(mockCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe('when a scroll event occurs', () => {
    beforeEach(() => {
      jest.advanceTimersByTime(99);
      eventMap.scroll();
    });

    describe('when the initial timeout is reached', () => {
      beforeEach(() => {
        jest.advanceTimersByTime(2);
      });

      it('does not invoke the callback', () => {
        expect(mockCallback).not.toHaveBeenCalled();
      });
    });

    describe('when scrolling stopped', () => {
      beforeEach(() => {
        // A new timer was scheduled when the scroll event happened
        // after 99ms. Advancing the timers by another 100ms will fire
        // the second timer.
        jest.advanceTimersByTime(300);
      });

      it('invokes the callback', () => {
        expect(mockCallback).toHaveBeenCalledTimes(1);
      });
    });

    describe('when cleanup was invoked', () => {
      beforeEach(() => {
        cleanup();

        // A new timer was scheduled when the scroll event happened
        // after 99ms. Advancing the timers by another 100ms will fire
        // the second timer.
        jest.advanceTimersByTime(100);
      });

      it('does not invoke callback', () => {
        expect(mockCallback).not.toHaveBeenCalled();
      });
    });
  });
});
