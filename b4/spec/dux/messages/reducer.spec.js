import reducer from '../../../src/dux/messages/reducer';
import * as types from '../../../src/dux/messages/types';

const initialState = [];

describe('Messages reducer', () => {
  test('should return the initial state', () => {
    expect(reducer(initialState, {})).toEqual(initialState);
  });

  describe('add message', () => {
    const name = 'TEST/MESSAGE';
    test('should add message name to state', () => {
      const action = {
        type: types.ADD_MESSAGE,
        payload: name
      };
      expect(reducer(initialState, action)).toEqual([name]);
    });

    test('should not add the same message more than once', () => {
      const action = {
        type: types.ADD_MESSAGE,
        payload: name
      };
      expect(reducer([
        ...initialState,
        name
      ], action)).toEqual([name]);
    });
  });

  describe('remove message', () => {
    const name = 'TEST/MESSAGE';
    test('should remove message name from state', () => {
      const action = {
        type: types.REMOVE_MESSAGE,
        payload: name
      };
      expect(reducer([name], action)).toEqual([]);
    });
  });
});

