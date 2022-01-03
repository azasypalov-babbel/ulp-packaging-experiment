/* eslint-disable camelcase */
import {
  ApiContentSharedModelsV2RemoteLessonYml as LessonV2,
  ApiContentSharedModelsV2TrainerYmlPropertiesTrainer as TrainerV2
} from '../../../@types/babbel.apigateway';

import { log } from '../../lib/logging';
import { ILessonService } from './interface';

const demoLessonService: ILessonService = {
  getLessonData: async (params) => {
    const demoLessons = await import(/* webpackChunkName: "demo" */ '../../demo/data/lesson');

    const response: LessonV2 | undefined = demoLessons.default[params.lessonUuid]?.default;

    if (!response) {
      throw new Error(`Could not find demo content at 'src/demo/data/lesson${params.lessonUuid}.json'`)
    }

    const urlParams = new URLSearchParams(window.location.search);
    const translationVisibility = urlParams.get('translationVisibility');
    const allowedTranslationVisibilities = ['full', 'partial', 'none'];

    const isValid = (translationVisibility: string): translationVisibility is TrainerV2.translation_visibility => {
      return allowedTranslationVisibilities.includes(translationVisibility)
    }

    if (translationVisibility !== null && isValid(translationVisibility)) {
      response.lesson.trainers = response.lesson.trainers.map((trainer) => (
        {
          ...trainer,
          translation_visibility: translationVisibility
        }
      ));
    }

    log('demoLessonService#getLessonData', response);

    return response;
  },

  postLessonCompleted: async (params) => {
    log('demoLessonService#postLessonCompleted', params);
  }
}

export default demoLessonService;
