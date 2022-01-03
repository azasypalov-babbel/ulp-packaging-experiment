import * as types from './types';

const initialState = {
  shortcuts: [],
  showHints: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.REGISTER_SHORTCUT: {
      const { listenToKey } = action.payload;
      const shortcuts = [
        ...state.shortcuts
      ];

      shortcuts.push(listenToKey);

      return {
        ...state,
        shortcuts
      };
    }

    case types.UNREGISTER_SHORTCUT: {
      const { listenToKey } = action.payload;

      const shortcutIndex = state.shortcuts.indexOf(listenToKey);

      if (shortcutIndex !== -1) {
        const shortcuts = [
          ...state.shortcuts
        ];

        // Note: components may mount registering the same listenToKey
        // before old components registering the same key have unmounted.
        // So a state like this is possible:
        //
        // {
        //   shortcuts: ['Enter', '1', '2', 'Enter']
        // }
        //
        // Therefore we are only removing the first occurence of a matching shortcut
        shortcuts.splice(shortcutIndex, 1);

        return {
          ...state,
          shortcuts
        };
      }

      return state;
    }

    case types.TOGGLE_HINTS: {
      return {
        ...state,
        showHints: !state.showHints
      };
    }

    default: {
      return state;
    }
  }
}
