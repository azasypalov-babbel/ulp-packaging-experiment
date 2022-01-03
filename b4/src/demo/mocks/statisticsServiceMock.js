import { log } from '../../lib/logging';

const fetchTrainerItemsStatistics = () => {
  const response = {
    dueVocabularyCount: 420,
    knowledgeLevels: [
      { level: 0, numberOfItems: 42 },
      { level: 1, numberOfItems: 42 },
      { level: 2, numberOfItems: 2 },
      { level: 3, numberOfItems: 4 },
      { level: 4, numberOfItems: 420 },
      { level: 5, numberOfItems: 0 }
    ],
    nextSessionCount: 42,
    score: 200,
    totalVocabularyCount: 4200
  };

  log('statisticsServiceMock#fetchTrainerItemsStatistics', response);

  return Promise.resolve(response);
};

export default {
  fetchTrainerItemsStatistics
};
