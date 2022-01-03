import { addMessage, removeMessage } from '../../../src/dux/messages/actions';
import * as types from '../../../src/dux/messages/types';

describe('Messages actions', () => {
  const name = 'TEST/MESSAGE';
  describe('addMessage', () => {
    it('should dispatch action with message name', () => {
      expect(addMessage(name)).toEqual({
        type: types.ADD_MESSAGE,
        payload: name
      });
    });
  });
  describe('removeMessage', () => {
    it('should dispatch action with message name', () => {
      expect(removeMessage(name)).toEqual({
        type: types.REMOVE_MESSAGE,
        payload: name
      });
    });
  });
});
