import reducer from '../../../src/dux/content/reducer';

const initialState = {
  data: null,
  loading: null,
  error: null
};

const learnLanguage = {
  unlocked: true
};

describe('content reducer', () => {
  test('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual(initialState);
  });

  describe('FETCH_LEARN_LANGUAGE_PENDING', () => {
    const action = {
      type: 'CONTENT/FETCH_LEARN_LANGUAGE_PENDING'
    };

    test('should update loading state', () => {
      expect(reducer(initialState, action)).toMatchObject({
        loading: true
      });
    });

    test('should reset error state', () => {
      expect(reducer(initialState, action)).toMatchObject({
        error: null
      });
    });
  });

  describe('FETCH_LEARN_LANGUAGE_FULFILLED', () => {
    const action = {
      type: 'CONTENT/FETCH_LEARN_LANGUAGE_FULFILLED',
      payload: learnLanguage
    };

    test('should store data from payload', () => {
      expect(reducer(initialState, action)).toMatchObject({
        data: learnLanguage
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

  describe('FETCH_LEARN_LANGUAGE_REJECTED', () => {
    const action = {
      type: 'CONTENT/FETCH_LEARN_LANGUAGE_REJECTED'
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
