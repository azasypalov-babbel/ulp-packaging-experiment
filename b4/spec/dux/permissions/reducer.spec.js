import reducer from '../../../src/dux/permissions/reducer';
import { SET_PERMISSION_COMPLETED } from '../../../src/dux/permissions/types';


const initialState = [];

describe('MicOnboarding reducer', () => {
  test('should return the initial state', () => {
    const received = reducer(initialState, {});
    expect(received).toEqual(initialState);
  });

  describe('setMicOnboardingCompleted', () => {
    test('should add payload to state', () => {
      const action = {
        type: SET_PERMISSION_COMPLETED,
        payload: true
      };

      const received = reducer(initialState, action);
      expect(received).toEqual({
        completed: action.payload
      });
    });
  });
});

