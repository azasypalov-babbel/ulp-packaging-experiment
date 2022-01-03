import getAwsApiClient from '../../awsApiClient';
import camelize from 'camelize';

const fetchSubstitutions = ({ locale, learnLanguageAlpha3 }) => {
  if (!locale) {
    throw 'Missing required param "locale"';
  }
  if (!learnLanguageAlpha3) {
    throw 'Missing required param "learnLanguageAlpha3"';
  }

  const apiClient = getAwsApiClient();


  return apiClient.fetch({
    verb: 'GET',
    path: `v1.0.0/${locale}/speech_recognition_substitutions`,
    query: { learn_language_alpha3: learnLanguageAlpha3 }
  })
    .then(({ data }) => camelize(data.speech_recognition_substitutions));
};

export default {
  fetchSubstitutions
};
