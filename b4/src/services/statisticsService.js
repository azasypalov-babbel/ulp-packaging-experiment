import camelize from 'camelize';
import getAwsApiClient from '../services/awsApiClient';
import { buildPath } from '../lib/apiPathHelper';

const version = '1.1.0';

const fetchTrainerItemsStatistics = ({ locale, learnLanguageAlpha3 }) => {
  const apiClient = getAwsApiClient();

  return apiClient
    .authenticate(locale)
    .then((uuid) => apiClient.fetch({
      verb: 'GET',
      path: buildPath({ version, locale, uuid, learnLanguageAlpha3 }, 'trainer_items/statistics')
    }))
    .then(({ data }) => camelize(data.statistics));
};

export default {
  fetchTrainerItemsStatistics
};
