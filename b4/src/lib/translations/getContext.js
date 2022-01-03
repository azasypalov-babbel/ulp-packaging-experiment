
const getTranslationsContext = () => {
  return require.context('../../../../lang/lesson_player/', true, /\.json$/);
};

export default getTranslationsContext;

