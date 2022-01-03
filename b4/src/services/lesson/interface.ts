import { ApiContentSharedModelsV2RemoteLessonYml as LessonV2 } from "../../../@types/babbel.apigateway";

export interface IGetLessonParams {
  learnLanguageAlpha3: string,
  locale: string,
  lessonUuid: string,
  learningActivityId: string,
  contentReleaseId: string
}

export interface IPostLessonParams extends IGetLessonParams {
  courseId: string,
  courseOverviewId: string
}

export interface ILessonService {
  /**
   * Fetches V2 lesson data for a single lesson. The current user needs to be authorized to view the requested lesson.
   *
   * Fun fact: Lesson v3 api returns v2 content see here: https://github.com/lessonnine/babbel.apigateway/blob/cd03d1ca0424c6c067214cb40064b3136575f632/api/content/v3/lessons/show.yml#L61
   */
  getLessonData: (params: IGetLessonParams) => Promise<LessonV2>

  /**
   * Marks a given lesson as completed in the backend for the current user.
   */
  postLessonCompleted: (params: IPostLessonParams) => Promise<void>
}

export interface INativeLessonFinishParams {
  lessonUuid: string
  learningActivityId: string
  courseId: string
  courseOverviewId: string
  locale: string
  learnLanguageAlpha3: string
  contentReleaseId: string
  completed: boolean
}

export interface INativeLessonService {
  /**
   * Fetches V2 lesson data for a single lesson. The current user needs to be authorized to view the requested lesson.
   *
   * Fun fact: Lesson v3 api returns v2 content see here: https://github.com/lessonnine/babbel.apigateway/blob/cd03d1ca0424c6c067214cb40064b3136575f632/api/content/v3/lessons/show.yml#L61
   */
  getLessonData: () => Promise<LessonV2>

  /**
   * Marks a given lesson as completed in the backend for the current user.
   */
  postLessonCompleted: (params: IPostLessonParams) => void

  /**
   * Marks a given lesson as stopped but not completed in the backend for the current user.
   */
  postLessonAbort: (params: IPostLessonParams) => void

  /**
   * Marks a lesson as closed by the user
   */
  closeLesson: () => void
}
