// profile dux created for use for smart-surfaces functionality
import * as types from './types';

const initialState = {
  loading: null,
  data: null,
  error: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case `${types.FETCH_PROFILE}_PENDING`: {
      return {
        ...state,
        loading: true,
        error: null
      };
    }

    case `${types.FETCH_PROFILE}_FULFILLED`: {
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: null
      };
    }

    case `${types.FETCH_PROFILE}_REJECTED`: {
      return {
        ...state,
        loading: false,
        error: true
      };
    }

    default: {
      return state;
    }
  }
}
