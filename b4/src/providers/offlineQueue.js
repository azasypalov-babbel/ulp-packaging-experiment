import React from 'react';

import { getDisplayName } from '../components/getDisplayName';

import OfflineQueueDispatcher from '../components/NetworkStatus/OfflineQueueDispatcher';

export const withOfflineQueue = (eventHost = window) => (
  WrappedComponent,
) => {
  function WithOfflineQueue(props) {
    return (
      <>
        <OfflineQueueDispatcher eventHost={eventHost} />
        <WrappedComponent {...props} />
      </>
    );
  }

  WithOfflineQueue.displayName = `WithOfflineQueue(${getDisplayName(
    WrappedComponent
  )})`;

  return WithOfflineQueue;
};

export default withOfflineQueue(window);
