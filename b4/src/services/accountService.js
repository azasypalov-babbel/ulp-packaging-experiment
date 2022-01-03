import camelize from 'camelize';
import getAwsApiClient from '../services/awsApiClient';

const version = '1.1.0';

const fetchAccount = (locale) => {
  const apiClient = getAwsApiClient();

  return apiClient
    .authenticate(locale)
    .then((uuid) => apiClient.fetch({
      verb: 'GET',
      path: `v${version}/${locale}/accounts/${uuid}/`
    }))
    .then(({ data }) => camelize(data.account));
};

export default {
  fetchAccount
};
