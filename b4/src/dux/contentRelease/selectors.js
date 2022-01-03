export const contentReleaseId = (state) => {
  if (!state.data) return null;

  return state.data.id;
};
