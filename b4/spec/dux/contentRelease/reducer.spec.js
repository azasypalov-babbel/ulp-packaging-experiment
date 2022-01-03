import reducer from '../../../src/dux/contentRelease/reducer';

const initialState = {
  data: null,
  loading: null,
  error: null
};

const contentRelease = {
  id: 'foo',
  locale: 'en',
  learnLanguageAlpha3: 'DEU'
};

describe('contentRelease reducer', () => {
  test('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual(initialState);
  });

  describe('FETCH_CONTENT_RELEASE_PENDING', () => {
    const action = {
      type: 'CONTENT_RELEASE/FETCH_CONTENT_RELEASE_PENDING'
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

  describe('FETCH_CONTENT_RELEASE_FULFILLED', () => {
    const action = {
      type: 'CONTENT_RELEASE/FETCH_CONTENT_RELEASE_FULFILLED',
      payload: contentRelease
    };

    test('should store data from payload', () => {
      expect(reducer(initialState, action)).toMatchObject({
        data: contentRelease
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

  describe('FETCH_CONTENT_RELEASE_REJECTED', () => {
    const action = {
      type: 'CONTENT_RELEASE/FETCH_CONTENT_RELEASE_REJECTED'
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
