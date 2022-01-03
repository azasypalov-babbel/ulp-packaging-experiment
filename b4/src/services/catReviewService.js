import { CAT_PREVIEW_REVIEW_DATA, getDataFromCat } from './catServicesHelper';
import { fixMockedReviewTrainerTypes } from '../demo/mocks/reviewServiceMock';
import { log } from '../lib/logging';

const getReviewTypes = () => {
  return import(/* webpackChunkName: "demo" */ '../demo/data/review/interaction_types.json').then((data) => {
    const response = data.interaction_types;
    log('catReviewService#getReviewTypes', response);
    return response;
  });
};

const getReviewItems = ({ params }) =>
  getDataFromCat(CAT_PREVIEW_REVIEW_DATA, 'catReviewService: getReviewItems')
    .then((data) => {
      const response = fixMockedReviewTrainerTypes(data.previewData, params.interaction_type);
      log('catReviewService#getReviewItems', response);
      return response;
    });

const updateVocabularyItems = (params) => {
  log('catReviewService#updateVocabularyItems', params);
};

const postReviewCompleted = () => {
  log('catReviewService#postReviewCompleted');
};

const postReviewAborted = () => {
  log('catReviewService#postReviewAborted');
};

export default {
  getReviewTypes,
  getReviewItems,
  updateVocabularyItems,
  postReviewCompleted,
  postReviewAborted
};
