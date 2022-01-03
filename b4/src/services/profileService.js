// Service created for use for smart-surfaces functionality
import camelize from 'camelize';
import getAwsApiClient from '../services/awsApiClient';

const version = '1';

const fetchProfile = (locale) => {
  const apiClient = getAwsApiClient();

  return apiClient
    .authenticate(locale)
    .then((uuid) => apiClient.fetch({
      verb: 'GET',
      path: `v${version}/${locale}/accounts/${uuid}/profile`
    }))
    .then(({ data }) => camelize(data.profile));
};

export default {
  fetchProfile
};
