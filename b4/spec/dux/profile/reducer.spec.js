import reducer from '../../../src/dux/profile/reducer';

const initialState = {
  data: null,
  loading: null,
  error: null
};

describe('profile reducer', () => {
  test('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual(initialState);
  });

  describe('FETCH_PROFILE_PENDING', () => {
    const action = {
      type: 'PROFILE/FETCH_PROFILE_PENDING'
    };

    test('should update loading state', () => {
      expect(reducer(initialState, action)).toMatchObject({
        loading: true
      });
    });
  });

  describe('FETCH_PROFILE_FULFILLED', () => {
    const action = {
      type: 'PROFILE/FETCH_PROFILE_FULFILLED',
      payload: { b2bUser: true }
    };

    test('should store data from payload', () => {
      expect(reducer(initialState, action)).toMatchObject({
        data: action.payload
      });
    });

    test('should update loading state', () => {
      expect(reducer(initialState, action)).toMatchObject({
        loading: false
      });
    });

    test('should reset error state', () => {
      expect(reducer(initialState, action)).toMatchObject({
        error: null
      });
    });
  });

  describe('FETCH_PROFILE_REJECTED', () => {
    const action = {
      type: 'PROFILE/FETCH_PROFILE_REJECTED',
      error: true
    };

    test('should update loading state', () => {
      expect(reducer(initialState, action)).toMatchObject({
        loading: false
      });
    });

    test('should update error state', () => {
      expect(reducer(initialState, action)).toMatchObject({
        error: true
      });
    });
  });
});
