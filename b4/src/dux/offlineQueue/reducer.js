import { OFFLINE, ONLINE } from './types';
import { combineReducers } from 'redux';

export function isOnline(state = true, action) {
  switch (action.type) {
    case OFFLINE:
      return false;

    case ONLINE:
      return true;

    default:
      return state;
  }
}

export default combineReducers({ isOnline });
