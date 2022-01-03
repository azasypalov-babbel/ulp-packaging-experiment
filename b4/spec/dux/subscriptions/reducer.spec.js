import reducer from '../../../src/dux/subscriptions/reducer';

const initialState = {
  data: null,
  loading: null,
  error: null
};

describe('subscriptions reducer', () => {
  test('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual(initialState);
  });

  describe('FETCH_SUBSCRIPTIONS_PENDING', () => {
    const action = {
      type: 'SUBSCRIPTIONS/FETCH_SUBSCRIPTIONS_PENDING'
    };

    test('should update loading state', () => {
      expect(reducer(initialState, action)).toMatchObject({
        loading: true
      });
    });
  });

  describe('FETCH_SUBSCRIPTIONS_FULFILLED', () => {
    const action = {
      type: 'SUBSCRIPTIONS/FETCH_SUBSCRIPTIONS_FULFILLED',
      payload: [{ type: 'web_purchase' }]
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

  describe('FETCH_SUBSCRIPTIONS_REJECTED', () => {
    const action = {
      type: 'SUBSCRIPTIONS/FETCH_SUBSCRIPTIONS_REJECTED',
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
