import * as types from './types';

const initialState = {
  ready: false,
  isOpen: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.INIT: {
      return { ...state, ready: true };
    }

    case types.SET_IS_OPEN: {
      const { isOpen } = action.payload;

      return {
        ...state,
        isOpen
      };
    }

    default: {
      return state;
    }
  }
}
