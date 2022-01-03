import * as types from './types';

const initialState = {
  loading: null,
  error: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case `${types.FETCH_EXPERIMENT_BUCKET}_PENDING`: {
      return { ...state, loading: true, error: null };
    }

    case `${types.FETCH_EXPERIMENT_BUCKET}_FULFILLED`: {
      const { target, variation } = action.payload;

      return {
        ...state,
        [target]: variation,
        loading: false,
        error: null
      };
    }

    case `${types.FETCH_EXPERIMENT_BUCKET}_REJECTED`: {
      return { ...state, loading: false, error: true };
    }

    default: {
      return state;
    }
  }
}
