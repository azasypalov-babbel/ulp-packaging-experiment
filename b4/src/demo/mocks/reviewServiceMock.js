import { log } from '../../lib/logging';

export const fixMockedReviewTrainerTypes = (data, interactionType) => {
  const { review_session: reviewSession } = data;
  const { trainers } = reviewSession;

  // Based on the requested interaction (flashcard|listen|speak|write),
  // different trainer types and interactions are expected than are in the mock JSON files:
  let enhancedTrainers;
  if (interactionType === 'listen') {
    const allItems = trainers.map((trainer) => {
      return trainer.item_groups.map((group) => {
        return group.items;
      });
    });

    enhancedTrainers = [{
      ...trainers[0],
      type: 'listening',
      interaction: 'show',
      item_groups: [{ items: allItems.flat(2) }]
    }];
  } else {
    enhancedTrainers = trainers.map((trainer) => {
      switch (interactionType) {
        case 'flashcard': {
          return { ...trainer, type: 'flashcard', interaction: 'show' };
        }

        case 'speak': {
          return { ...trainer, type: 'spokenreview', interaction: 'speak' };
        }

        case 'write': {
          return trainer;
        }

        default: {
          throw new Error(`unsupported interaction type: ${interactionType}`);
        }
      }
    });
  }

  return {
    ...data,
    review_session: {
      ...reviewSession,
      trainers: enhancedTrainers
    }
  };
};

const getReviewTypes = () => {
  return import(/* webpackChunkName: "demo" */ '../data/review/interaction_types.json').then((module) => {
    const response = module.default.interaction_types;
    log('reviewServiceMock#getReviewTypes', response);
    return response;
  });
};

// getReviewItems() is called at the start and end of a review session.
//
// The review server behavior is mocked by loading data files.
// Each round of review (call 1 or 3 to the mock server) will load a
// different json file with different review words. No more data is available
// after the 2nd round of reviews.
//
// call 1: starting of 1st review session
// call 2: end of 1st review session
// call 3: beginning of 2nd review session
// call 4: end of the 2nd review session

// In order to test other review words and not interfere with the
// previously written tests, we load a different json file if call count is 10.
// To set the call count to 10, it has to be set via an URL param (see below).
// And it cannot otherwise be set by the 'normal' review flow in demo mode
// because review breaks off after the 4th call to the mock server.
// localhost.../.../review?review_call_count=10&...
//
let reviewCallCount = 0;
const getReviewItems = ({ params }) => {
  log('reviewServiceMock#getReviewItems');

  reviewCallCount += 1;

  const unwrapModule = (module) => module.default;
  const fixTrainerTypes = (data) => fixMockedReviewTrainerTypes(data, params.interaction_type);

  const searchString = 'mock_review_items';
  const otherReviewItems = window.location.search
    .split('&')
    .filter((x) => { return x.match(searchString); });

  if (otherReviewItems.length > 0) {
    const otherItems = otherReviewItems[0].split('=')[1];

    return import(
      /* webpackChunkName: "demo" */
      `../data/review/${otherItems}.json`
    ).then(unwrapModule).then(fixTrainerTypes);
  }

  switch (reviewCallCount) {
    case 1:
      return import(
        /* webpackChunkName: "demo" */
        '../data/review/initial_review_items.json'
      ).then(unwrapModule).then(fixTrainerTypes);
    case 2:
    case 3:
      return import(
        /* webpackChunkName: "demo" */
        '../data/review/more_review_items.json'
      ).then(unwrapModule).then(fixTrainerTypes);
    default:
      return import(
        /* webpackChunkName: "demo" */
        '../data/review/no_more_review_items.json'
      ).then(unwrapModule).then(fixTrainerTypes);
  }
};

const updateVocabularyItems = (params) => {
  log('reviewServiceMock#updateVocabularyItems', params);
};

const postReviewCompleted = () => {
  log('reviewServiceMock#postReviewCompleted');
};

const postReviewAborted = () => {
  log('reviewServiceMock#postReviewAborted');
};

export default {
  getReviewTypes,
  getReviewItems,
  updateVocabularyItems,
  postReviewCompleted,
  postReviewAborted
};
