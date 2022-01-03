import React from 'react';

import store from '../store';
import { Provider } from 'react-redux';
import { getDisplayName } from '../components/getDisplayName';

const withStoreProvider = (WrappedComponent) => {
  const StoreProvider = (props) => (
    <Provider store={store}>
      <WrappedComponent {...props} />
    </Provider>
  );

  StoreProvider.displayName = `StoreProvider(${getDisplayName(WrappedComponent)})`;

  return StoreProvider;
};

export default withStoreProvider;
