import * as types from './types';

const initialState = {
  data: null,
  loading: null,
  error: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case `${types.FETCH_CONTENT_RELEASE}_PENDING`: {
      return { ...state, loading: true, error: null };
    }

    case `${types.FETCH_CONTENT_RELEASE}_FULFILLED`: {
      return { ...state, data: action.payload, loading: false, error: null };
    }

    case `${types.FETCH_CONTENT_RELEASE}_REJECTED`: {
      return { ...state, loading: false, error: true };
    }

    case types.SET_CONTENT_RELEASE_ID: {
      return {
        ...state,
        data: {
          ...state.data,
          id: action.payload
        }
      };
    }

    default: {
      return state;
    }
  }
}
