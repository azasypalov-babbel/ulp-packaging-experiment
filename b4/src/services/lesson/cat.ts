import { CAT_PREVIEW_LESSON_DATA, getDataFromCat } from '../catServicesHelper';
import { log } from '../../lib/logging';
import { ILessonService } from './interface';
import { ApiContentSharedModelsV2RemoteLessonYml as LessonV2 } from '../../../@types/babbel.apigateway';

const catLessonService: ILessonService = {
  getLessonData: async () => {
    return getDataFromCat(CAT_PREVIEW_LESSON_DATA, 'catLessonService: getLessonData')
      .then((data) => {
        const response: LessonV2 = data.previewData;
        log('catLessonService#getLessonData', response);
        return response;
      });
  },
  postLessonCompleted: async (params) => {
    log('catLessonService#postLessonCompleted', params);
  }
}

export default catLessonService;
