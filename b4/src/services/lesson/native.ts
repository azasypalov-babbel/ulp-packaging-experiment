import { NativeBridge } from '../../lib/nativeBridge';
import { log } from '../../lib/logging';
import {
  INativeLessonFinishParams,
  INativeLessonService,
  IPostLessonParams
} from './interface';
import { ApiContentSharedModelsV2RemoteLessonYml as LessonV2 } from '../../../@types/babbel.apigateway';

const BRIDGE_NAME = 'lesson';
const BRIDGE_METHODS = {
  COMPLETE: 'COMPLETE',
  END: 'END',
  ABORT: 'ABORT'
};

export const BRIDGE_EVENTS = {};

class NativeLessonService extends NativeBridge implements INativeLessonService {
  constructor() {
    super(
      BRIDGE_NAME,
      BRIDGE_EVENTS,
      BRIDGE_METHODS
    );
  }

  getLessonData() {
    const data = this.getStatic();
    const response: LessonV2 = { lesson: data.lesson };

    log('nativeLessonService#getLessonData', response);

    return Promise.resolve(response);
  }

  postLessonCompleted(params: IPostLessonParams) {
    log('nativeLessonService#postLessonCompleted');
    this.postLessonFinish({ ...params, completed: true });
  }

  postLessonAbort(args) {
    log('nativeLessonService#postLessonAbort');
    this.postLessonFinish({ ...args, completed: false });
  }

  // Additional interface methods for webview implementation
  closeLesson() {
    log('nativeLessonService#closeLesson');
    this.postMessage(BRIDGE_METHODS.END);
  }

  private postLessonFinish(params: INativeLessonFinishParams) {
    const payload = {
      lesson: {
        id: params.learningActivityId,
        title: '',
        completed: params.completed,
        include: {
          id: params.lessonUuid
        }
      },
      courseOverview: {
        id: params.courseOverviewId
      },
      course: {
        id: params.courseId
      },
      contentRelease: {
        locale: params.locale,
        learnLanguageAlpha3: params.learnLanguageAlpha3,
        id: params.contentReleaseId
      }
    };

    this.postMessage(
      params.completed
        ? BRIDGE_METHODS.COMPLETE
        : BRIDGE_METHODS.ABORT,
        payload
    );

    log('nativeLessonService#postLessonFinish', payload);
  }
}

export default new NativeLessonService();
