import { createSelector } from 'reselect';

const accountSelector = (state) => state.data;

export const displayName = createSelector(
  accountSelector,
  (account) => account.displayname
);

export const email = createSelector(
  accountSelector,
  (account) => account.email
);

// Introduced for smart-surfaces feature
export const createdAt = createSelector(
  accountSelector,
  (account) => account.createdAt
);

export const isBabbelUser = createSelector(
  accountSelector,
  (account) => {
    const domain = account.email?.split('@')[1] || '';
    return domain === 'babbel.com';
  }
);
