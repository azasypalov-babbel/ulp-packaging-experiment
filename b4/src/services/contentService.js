import camelize from 'camelize';
import getAwsApiClient from '../services/awsApiClient';
import { buildPathV5 } from '../lib/apiPathHelper';

// Selecting specific attributes for the query to the learn_languages API endpoint.
// This overwrites the default parameters we specify to send to the serializer.
// Please refer to https://github.com/lessonnine/api_serializers.gem
// and https://github.com/lessonnine/home.babbel/blob/develop/app/controllers/api_v5/learn_languages_controller.rb
// for more clarity
export const DEFAULT_QUERY = {
  'includes[0]': 'learn_language.course_overviews.courses.lessons',
  'includes[1]': 'learn_language.course_overviews.image',
  'includes[2]': 'learn_language.course_overviews.courses.lessons.image',
  'lesson_attributes[0]': 'id',
  'lesson_attributes[1]': 'completed',
  'lesson_attributes[2]': 'detailed_description_html',
  'lesson_attributes[3]': 'title',
  'lesson_attributes[4]': 'description'
};

const fetchLearnLanguage = ({ contentReleaseId, locale, learnLanguageAlpha3, query = DEFAULT_QUERY }) => {
  const apiClient = getAwsApiClient();

  return apiClient
    .authenticate(locale)
    .then((uuid) => apiClient.fetch({
      verb: 'GET',
      path: buildPathV5({ version: '2', locale, uuid, contentReleaseId, learnLanguageAlpha3 }),
      query
    }))
    .then(({ data }) => camelize(data.learn_language));
};

export default {
  fetchLearnLanguage
};
