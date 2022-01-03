import * as types from './types';

const initialState = {
  loading: null,
  data: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case `${types.FETCH_TRAINER_ITEMS_STATISTICS}_PENDING`: {
      return { ...state, loading: true };
    }

    case `${types.FETCH_TRAINER_ITEMS_STATISTICS}_FULFILLED`: {
      return { ...state, loading: false, data: action.payload };
    }

    case `${types.FETCH_TRAINER_ITEMS_STATISTICS}_REJECTED`: {
      return { ...state, loading: false };
    }

    default: {
      return state;
    }
  }
}
