import * as types from './types';

export const requestPrompt = (attemptText) => ({
  type: types.REQUEST_PROMPT,
  payload: {
    attemptText
  }
});

export const receivePrompt = (attempt) => ({
  type: types.RECEIVE_PROMPT,
  payload: {
    ...attempt
  }
});

export const play = () => ({
  type: types.PLAY
});
