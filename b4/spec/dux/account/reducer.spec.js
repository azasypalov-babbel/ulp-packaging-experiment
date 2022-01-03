import reducer from '../../../src/dux/account/reducer';

const initialState = {
  data: {
    uuid: null,
    email: null,
    displayname: null,
    neo: null,
    confirmedAt: null,
    createdAt: null
  },
  loading: null,
  error: null
};

describe('account reducer', () => {
  test('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual(initialState);
  });

  describe('FETCH_ACCOUNT_PENDING', () => {
    const action = {
      type: 'ACCOUNT/FETCH_ACCOUNT_PENDING'
    };

    test('should update loading state', () => {
      expect(reducer(initialState, action)).toMatchObject({
        loading: true
      });
    });
  });

  describe('FETCH_ACCOUNT_FULFILLED', () => {
    const action = {
      type: 'ACCOUNT/FETCH_ACCOUNT_FULFILLED',
      payload: { uuid: 'mock-uuid' }
    };

    test('should store data from payload', () => {
      expect(reducer(initialState, action)).toMatchObject({
        data: { uuid: 'mock-uuid' }
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

  describe('FETCH_ACCOUNT_REJECTED', () => {
    const action = {
      type: 'ACCOUNT/FETCH_ACCOUNT_REJECTED',
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
