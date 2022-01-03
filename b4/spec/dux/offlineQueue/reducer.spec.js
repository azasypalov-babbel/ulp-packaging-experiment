import reducer from '../../../src/dux/offlineQueue/reducer';
import { OFFLINE, ONLINE } from '../../../src/dux/offlineQueue/types';

const initialState = {
  isOnline: true
};

describe('offline queue reducer', () => {
  test('should return the initial state', () => {
    expect(reducer(initialState, {})).toEqual(initialState);
  });

  describe('when #online', () => {
    describe('dispatching OFFLINE action', () => {
      test('updates state', () => {
        expect(reducer(initialState, { type: OFFLINE })).toEqual({ isOnline: false });
      });
    });
  });

  describe('when #offline', () => {
    describe('dispatching ONLINE action', () => {
      test('updates state', () => {
        expect(reducer({ isOnline: false }, { type: ONLINE })).toEqual({ isOnline: true });
      });
    });
  });
});
