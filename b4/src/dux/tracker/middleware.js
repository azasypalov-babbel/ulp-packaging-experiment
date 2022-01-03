import { isLesson, isReview } from '../session/selectors';
import middlewareReview from './middlewareReview';
import middlewareLesson from './middlewareLesson';

const middleware = (store) => (next) => (action) => {
  const { session } = store.getState();

  if (isReview(session)) {
    return middlewareReview(store)(next)(action);
  } else if (isLesson(session)) {
    return middlewareLesson(store)(next)(action);
  }

  return next(action);
};

export default middleware;
