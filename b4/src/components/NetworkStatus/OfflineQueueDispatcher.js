import React from 'react';
import * as PropTypes from 'prop-types';
import { ONLINE, OFFLINE } from '../../dux/offlineQueue/types';

import { connect } from 'react-redux';

export function OfflineQueueDispatcher(props) {
  const { eventHost = window, setOnline = ()=>{}, setOffline = ()=>{} } = props;

  React.useEffect(() => {
    eventHost.addEventListener('offline', setOffline);
    eventHost.addEventListener('online', setOnline);

    return () => {
      eventHost.removeEventListener('offline', setOffline);
      eventHost.removeEventListener('online', setOnline);
    };
  }, [eventHost, setOnline, setOffline]);
  return null;
}

OfflineQueueDispatcher.propTypes = {
  eventHost: PropTypes.any,
  setOnline: PropTypes.func,
  setOffline: PropTypes.func
};

const offlineQueueActions = {
  setOnline: () => ({
    type: ONLINE
  }),
  setOffline: () => ({
    type: OFFLINE
  })
};

export default connect(
  null,
  offlineQueueActions
)(OfflineQueueDispatcher);
