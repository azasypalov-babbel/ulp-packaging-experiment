import { createSelector } from 'reselect';

const subscriptionsSelector = (state = {}) => state.data;

const getSubscriptionDate = (subscriptions) => {
  if (!subscriptions) return null;

  return subscriptions.reduce((date, { startStateDate, active }) => (
    startStateDate && active ? startStateDate : date
  ), null);
};

export const subscriptionDate = createSelector(
  subscriptionsSelector,
  (subscriptions) => getSubscriptionDate(subscriptions)
);
