// Service created for use for smart-surfaces functionality
import camelize from 'camelize';
import getAwsApiClient from '../services/awsApiClient';

const version = '1';

const fetchSubscriptions = (locale) => {
  const apiClient = getAwsApiClient();

  return apiClient
    .authenticate(locale)
    .then((uuid) => apiClient.fetch({
      verb: 'GET',
      path: `v${version}/${locale}/accounts/${uuid}/subscriptions`
    }))
    .then(({ data }) => camelize(data.subscriptions));
};

export default {
  fetchSubscriptions
};
