import * as types from './types';

const initialState = [];

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.ADD_MESSAGE: {
      const name = action.payload;

      if (state.includes(name)) {
        return state;
      }

      return [
        ...state,
        name
      ];
    }

    case types.REMOVE_MESSAGE: {
      return state.filter((name) => name !== action.payload);
    }

    default: {
      return state;
    }
  }
}
