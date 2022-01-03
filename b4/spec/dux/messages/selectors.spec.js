import { getFirstMessage } from '../../../src/dux/messages/selectors';

describe('Messages selectors', () => {
  const state = [
    'TEST/MESSAGE1',
    'TEST/MESSAGE2'
  ];

  describe('getFirstMessage', () => {
    test('should return the first message', () => {
      expect(getFirstMessage(state)).toBe(state[0]);
    });
    describe('when no messages', () => {
      test('should return the first message', () => {
        expect(getFirstMessage([])).toBeUndefined();
      });
    });
  });
});
