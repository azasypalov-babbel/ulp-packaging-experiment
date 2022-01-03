/**
 * cat service implementations
 */
import lessonService from '../lesson/cat';
import reviewService from '../catReviewService';
import indexMock from './mock';

export default {
  ...indexMock,
  lessonService,
  reviewService
};
