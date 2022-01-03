import camelize from 'camelize';
import getAwsApiClient from '../services/awsApiClient';

const fetchContentRelease = ({ locale, learnLanguageAlpha3 }) => {
  const apiClient = getAwsApiClient();

  return apiClient
    .authenticate(locale)
    .then((uuid) => apiClient.fetch({
      verb: 'GET',
      path: `v2/${locale}/accounts/${uuid}/learn_languages/${learnLanguageAlpha3}/content_release`
    }))
    .then(({ data }) => camelize(data.content_release));
};

export default {
  fetchContentRelease
};
