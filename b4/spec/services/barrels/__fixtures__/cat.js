import catLessonService from '../../../../src/services/lesson/cat';
import catReviewService from '../../../../src/services/catReviewService';

import { mockedServices } from './mock';

/**
 * replica of ../../../../src/services/helper.js - catServices
 */
export const catServices = {
  ...mockedServices,
  lessonService: catLessonService,
  reviewService: catReviewService
};
