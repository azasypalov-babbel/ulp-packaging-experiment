import { log } from '../../lib/logging';

const getExperimentBucket = ({ locale, learnLanguageAlpha3, target }) => {
  log('abTesterServiceMock#getExperimentBucket', { locale, learnLanguageAlpha3, target });
  return Promise.resolve();
};

export default {
  getExperimentBucket
};
