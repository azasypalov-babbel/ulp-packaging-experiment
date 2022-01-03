import * as types from './types';

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

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case `${types.FETCH_ACCOUNT}_PENDING`: {
      return {
        ...state,
        loading: true,
        error: null
      };
    }

    case `${types.FETCH_ACCOUNT}_FULFILLED`: {
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: null
      };
    }

    case `${types.FETCH_ACCOUNT}_REJECTED`: {
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
