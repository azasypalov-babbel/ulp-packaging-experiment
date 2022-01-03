import * as types from './types';
import { getLocalStorage } from '../../lib/localStorage';
import { LOCALSTORAGE_NAMESPACE, PERMISSION_COMPLETED_KEY } from './actions';

const localStorage = getLocalStorage(LOCALSTORAGE_NAMESPACE);

// according to Permissions API, state can be 'prompt', 'granted', 'denied'
const initialState = {
  micPermission: 'prompt',
  completed: localStorage.get(PERMISSION_COMPLETED_KEY) === true
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.UPDATE_MIC_PERMISSION: {
      return {
        ...state,
        micPermission: action.payload
      };
    }

    case types.SET_PERMISSION_COMPLETED: {
      const completed = action.payload;

      return {
        ...state,
        completed
      };
    }

    default: {
      return state;
    }
  }
}
