import React from 'react';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { Provider } from 'react-redux';
import { action } from '@storybook/addon-actions';

const store = {
  getState() {
    return {
      keyboard: {
        showHints: boolean('redux.keyboard.showHints', false)
      }
    };
  },
  dispatch({ type, payload }) {
    const reduxDispatch = action(`@Redux/dispatch: ${type}`);
    reduxDispatch(JSON.stringify(payload));
  },
  subscribe() {}
};


const withStore = (getStory, context) => {
  return <Provider store={store}>{withKnobs(() => getStory(context), context)}</Provider>;
};

export default withStore;
