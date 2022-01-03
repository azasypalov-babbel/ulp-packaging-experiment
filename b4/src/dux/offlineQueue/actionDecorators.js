const applyMetadata = (target, metadata = {}) => {
  return Object.assign(target, { meta: { ...(target.meta || {}), ...metadata } });
};

export function offlineAction(creator) {
  return applyMetadata(creator, { queueIfOffline: true });
}

export function isOfflineAction(action) {
  if (action && action.meta) {
    return action.meta.queueIfOffline === true;
  }
  return false;
}
