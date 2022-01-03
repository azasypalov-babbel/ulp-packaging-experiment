import reducer from '../../../src/dux/keyboard/reducer';

const initialState = {
  shortcuts: [],
  showHints: false
};

describe('keyboard reducer', () => {
  test('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual(initialState);
  });

  describe('REGISTER_SHORTCUT', () => {
    const action = {
      type: 'KEYBOARD/REGISTER_SHORTCUT',
      payload: {
        listenToKey: 'Enter'
      }
    };

    test('adds the key', () => {
      expect(reducer(initialState, action)).toMatchObject({
        shortcuts: ['Enter']
      });
    });

    describe('when the same key is already registered', () => {
      test('adds the key', () => {
        const previousState = Object.assign({}, initialState, {
          shortcuts: ['Enter']
        });

        expect(reducer(previousState, action)).toMatchObject({
          shortcuts: ['Enter', 'Enter']
        });
      });
    });
  });

  describe('UNREGISTER_SHORTCUT', () => {
    const action = {
      type: 'KEYBOARD/UNREGISTER_SHORTCUT',
      payload: {
        listenToKey: 'Enter'
      }
    };

    test('removes the key', () => {
      const previousState = Object.assign({}, initialState, {
        shortcuts: ['Enter']
      });

      expect(reducer(previousState, action)).toMatchObject({
        shortcuts: []
      });
    });

    describe('when the key is registered more than once', () => {
      test('removes only one occurence', () => {
        const previousState = Object.assign({}, initialState, {
          shortcuts: ['Enter', 'Enter']
        });

        expect(reducer(previousState, action)).toMatchObject({
          shortcuts: ['Enter']
        });
      });
    });

    describe('when the key is not registered', () => {
      test('does not change the state', () => {
        const previousState = Object.assign({}, initialState, {
          shortcuts: ['1', '2']
        });

        expect(reducer(previousState, action)).toEqual(previousState);
      });
    });
  });

  describe('TOGGLE_HINTS', () => {
    const action = {
      type: 'KEYBOARD/TOGGLE_HINTS'
    };

    describe('when showHints is true', () => {
      test('toggles showHints', () => {
        const previousState = Object.assign({}, initialState, {
          showHints: true
        });

        expect(reducer(previousState, action)).toMatchObject({
          showHints: false
        });
      });
    });

    describe('when showHints is false', () => {
      test('toggles showHints', () => {
        const previousState = Object.assign({}, initialState, {
          showHints: false
        });

        expect(reducer(previousState, action)).toMatchObject({
          showHints: true
        });
      });
    });
  });
});
