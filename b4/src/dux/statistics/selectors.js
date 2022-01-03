export const totalVocabularyCount = (state) => {
  return state.data ? state.data.totalVocabularyCount : null;
};

// Used for smart-surfaces functionality
export const userHasCompletedLessons = (state = {}) => {
  return totalVocabularyCount(state) > 0;
};
