import reducer from '../../../src/dux/experiments/reducer';

const initialState = {
  loading: null,
  error: null
};

describe('experiments reducer', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  describe('FETCH_EXPERIMENT_BUCKET_PENDING', () => {
    const action = {
      type: 'EXPERIMENTS/FETCH_EXPERIMENT_BUCKET_PENDING'
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

  describe('FETCH_EXPERIMENT_BUCKET_FULFILLED', () => {
    const action = {
      type: 'EXPERIMENTS/FETCH_EXPERIMENT_BUCKET_FULFILLED',
      payload: {
        target: 'experimentTarget',
        variation: 'experimentVariation'
      }
    };

    test('should store data from payload', () => {
      expect(reducer(initialState, action)).toMatchObject({
        experimentTarget: 'experimentVariation'
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

  describe('FETCH_EXPERIMENT_BUCKET_REJECTED', () => {
    const action = {
      type: 'EXPERIMENTS/FETCH_EXPERIMENT_BUCKET_REJECTED'
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

