import { getMyEnv } from '@lessonnine/my.js';
import getAwsApiClient from '../services/awsApiClient';

const { uuid } = getMyEnv();

const getExperimentBucket = ({ locale, learnLanguageAlpha3, target }) => {
  const apiClient = getAwsApiClient();
  return apiClient.fetch({
    verb: 'GET',
    path: `v1.2.0/${locale}/ab-tester/${target}`,
    headers: {
      'X-Babbel-UUID': uuid
    },
    query: {
      learn_language_alpha3: learnLanguageAlpha3
    }
  })
    .then(({ data }) => data['ab-tester'].destination_value)
    .catch((error) => {
      if (error.response.status === 422) {
        /*
         * 422 Unprocessable Entity
         * Experiment for given target is set up, but the user is not part of the population filtering
         */
        return 'excluded';
      }
      throw error;
    });
};

export default {
  getExperimentBucket
};
