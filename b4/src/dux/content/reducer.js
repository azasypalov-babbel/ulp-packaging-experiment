import * as types from './types';

const initialState = {
  data: null,
  loading: null,
  error: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case `${types.FETCH_LEARN_LANGUAGE}_PENDING`: {
      return { ...state, loading: true, error: null };
    }

    case `${types.FETCH_LEARN_LANGUAGE}_FULFILLED`: {
      return { ...state, loading: false, data: action.payload, error: null };
    }

    case `${types.FETCH_LEARN_LANGUAGE}_REJECTED`: {
      return { ...state, loading: false, error: true };
    }

    default: {
      return state;
    }
  }
}
