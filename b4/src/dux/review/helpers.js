import { parseQueryParameters } from '../../lib/urlHelpers';
import { isAnalyzerLibRecognizerSupported } from '../../lib/speechHelper';

const REVIEW_SEARCH = 'REVIEW_SEARCH';
const REVIEW_DUE = 'REVIEW_DUE';

const getSearchQueryParams = () => {
  const queryParameters = parseQueryParameters();

  const mapping = {
    packageId: 'package_id',
    level: 'knowledge_level',
    search: 'q'
  };

  return Object.keys(queryParameters).reduce((acc, item) => {
    if (mapping[item]) {
      acc[mapping[item]] = queryParameters[item];
    }
    return acc;
  }, {});
};

export const getReviewQueryParams = (reviewType) => {
  if (reviewType === REVIEW_DUE) {
    return { filter: 'due' };
  } else if (reviewType === REVIEW_SEARCH) {
    return {
      filter: 'search',
      ...getSearchQueryParams()
    };
  }
};

export const filterInteractionTypes = (types) => {
  const interactionsCountMap = types.reduce((acc, type) => ({
    ...acc,
    [type.id]: type.count
  }), {});

  const interactions = [];

  if (interactionsCountMap['flashcard'] > 0) {
    interactions.push({
      id: 'flashcard',
      count: interactionsCountMap['flashcard']
    });
  }

  if (interactionsCountMap['listen'] > 3) {
    interactions.push({
      id: 'listen',
      count: interactionsCountMap['listen']
    });
  }

  if (isAnalyzerLibRecognizerSupported() && interactionsCountMap['speak'] > 3) {
    interactions.push({
      id: 'speak',
      count: interactionsCountMap['speak']
    });
  }

  if (interactionsCountMap['write'] > 0) {
    interactions.push({
      id: 'write',
      count: interactionsCountMap['write']
    });
  }

  return interactions;
};

export const countReviewItems = (trainers) => {
  return trainers.reduce((trainerTotal, trainer) => {
    return trainerTotal + trainer.item_groups.reduce((itemGroupTotal, itemGroup) => {
      return itemGroupTotal + itemGroup.items.length;
    }, 0);
  }, 0);
};
