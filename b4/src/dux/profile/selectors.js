export const isB2bUser = (state = {}) => (
  Boolean(state.data && state.data.b2bUser)
);
