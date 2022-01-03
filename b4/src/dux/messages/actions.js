import * as types from './types';

export const addMessage = (name) => ({
  type: types.ADD_MESSAGE,
  payload: name
});

export const removeMessage = (name) => ({
  type: types.REMOVE_MESSAGE,
  payload: name
});
