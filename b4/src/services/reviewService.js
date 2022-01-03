import getAwsApiClient from './awsApiClient';
import { buildPath } from '../lib/apiPathHelper';
import { normalizeQueryParameters } from '../lib/urlHelpers';

const getReviewTypes = ({ learnLanguageAlpha3, locale, params }) => {
  const apiClient = getAwsApiClient();
  return apiClient
    .authenticate(locale)
    .then((uuid) => apiClient.fetch({
      verb: 'GET',
      path: buildPath({ version: '1.1.0', locale, uuid, learnLanguageAlpha3 }, 'vocabulary/interaction_types'),
      query: params
    }))
    .then(({ data }) => data.interaction_types);
};

const getReviewItems = ({ learnLanguageAlpha3, locale, params }) => {
  const apiClient = getAwsApiClient();
  return apiClient
    .authenticate(locale)
    .then((uuid) => apiClient.fetch({
      verb: 'GET',
      path: buildPath({ version: '5', locale, uuid, learnLanguageAlpha3 }, 'review_session'),
      query: normalizeQueryParameters(params)
    }))
    .then(({ data }) => data);
};

const updateVocabularyItems = ({ locale, learnLanguageAlpha3, vocabularyItems }) => {
  const apiClient = getAwsApiClient();
  return apiClient
    .authenticate(locale)
    .then((uuid) => apiClient.fetch({
      verb: 'PUT',
      path: buildPath({ version: '5', locale, uuid, learnLanguageAlpha3 }, 'review_session'),
      body: {
        review_session: {
          items: vocabularyItems
        }
      }
    }));
};

const postReviewCompleted = () => {
  console.error('Not supported in this environment');
};

const postReviewAborted = () => {
  console.error('Not supported in this environment');
};

export default {
  getReviewTypes,
  getReviewItems,
  updateVocabularyItems,
  postReviewCompleted,
  postReviewAborted
};
