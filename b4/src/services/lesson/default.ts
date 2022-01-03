/* eslint-disable camelcase */
import getAwsApiClient from '../awsApiClient';
import { ILessonService } from './interface';
import { buildPathV5 } from '../../lib/apiPathHelper';
import { ApiContentSharedModelsV2RemoteLessonYml as LessonV2 } from '../../../@types/babbel.apigateway';

const lessonService: ILessonService = {

  getLessonData: async ({ learnLanguageAlpha3, locale, lessonUuid, learningActivityId, contentReleaseId }) => {
    const apiClient = getAwsApiClient();

    return apiClient.authenticate(locale)
    .then((uuid) => apiClient.fetch<LessonV2>({
      verb: 'GET',
      path: buildPathV5({ version: '3', locale, uuid, contentReleaseId, learnLanguageAlpha3 }, `lessons/${lessonUuid}`),
      query: { context_id: learningActivityId }
    }))
    .then(({data}) => data);
  },

  postLessonCompleted: async ({ learnLanguageAlpha3, locale, lessonUuid, learningActivityId, contentReleaseId }) => {
    const body = {
      finish: {
        context: {
          type: 'lesson',
          id: learningActivityId
        },
        created_at: new Date().toISOString()
      }
    };

    const apiClient = getAwsApiClient();

    return apiClient.authenticate(locale)
    .then((uuid) => apiClient.fetch<void>({
      verb: 'POST',
      path: buildPathV5({ version: '2', locale, uuid, contentReleaseId, learnLanguageAlpha3 }, `lessons/${lessonUuid}/finishes`),
      body
    }))
    .then(() => {});
  }
};

export default lessonService;
