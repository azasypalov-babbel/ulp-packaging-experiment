import * as types from './types';
import services from '../../services';
import { navigateToReturnUrl } from '../session/actions';
import * as lessonSessionEvents from '../tracker/events/lessonSession';
import * as contentSelectors from '../content/selectors';
import * as contentReleaseSelectors from '../contentRelease/selectors';
import * as features from '../../lib/features';
import { track } from '../tracker/actions';
import { abortSequence } from '../sequence/actions';
import { AppThunk, RootState } from '@src/store';
import { IGetLessonParams } from '@src/services/lesson/interface';

const lessonPayload = (getState: () => RootState) => {
  const { contentRelease, lesson, session, content } = getState();
  const { locale, learnLanguageAlpha3 } = session;
  const { lessonUuid, learningActivityId } = lesson;
  const { id: courseId } = contentSelectors.currentCourse(
    content,
    learningActivityId
  );
  const { id: courseOverviewId } = contentSelectors.currentCourseOverview(
    content,
    learningActivityId
  );
  const contentReleaseId = contentReleaseSelectors.contentReleaseId(contentRelease);

  return {
    contentReleaseId,
    learnLanguageAlpha3,
    locale,
    lessonUuid,
    learningActivityId,
    courseId,
    courseOverviewId
  };
};

export const initLesson = ({ contentReleaseId, lessonUuid, learningActivityId }: Partial<IGetLessonParams>) => {
  return {
    type: types.INIT_LESSON,
    payload: {
      contentReleaseId,
      lessonUuid,
      learningActivityId
    }
  };
};

export const fetchLessonData = (): AppThunk => (dispatch, getState) => {
  const { lessonService } = services;
  const { contentRelease, lesson, session } = getState();
  const { locale, learnLanguageAlpha3 } = session;
  const { lessonUuid, learningActivityId } = lesson;
  const contentReleaseId = contentReleaseSelectors.contentReleaseId(contentRelease);

  return dispatch({
    type: types.FETCH_LESSON_DATA,
    payload: lessonService.getLessonData({
      contentReleaseId,
      locale,
      learnLanguageAlpha3,
      lessonUuid,
      learningActivityId
    })
  });
};

export const postLessonCompleted = (): AppThunk => (dispatch, getState) => {
  const { lessonService } = services;

  return dispatch({
    type: types.POST_LESSON_COMPLETE,
    payload: lessonService.postLessonCompleted(lessonPayload(getState))
  });
};

export const completeLesson = (): AppThunk => (dispatch) => {
  return dispatch({
    type: types.COMPLETE_LESSON,
    payload: dispatch(postLessonCompleted())
  });
};

export const closeLesson = (): AppThunk => async (dispatch, getState) => {
  dispatch({
    type: types.CLOSE_LESSON
  });

  const { sequence: { completed: isLessonCompleted } } = getState();

  if (features.isWebview()) {
    const { lessonService } = services;
    if (!isLessonCompleted) {
      dispatch(abortSequence());
      lessonService.postLessonAbort(lessonPayload(getState));
    } else {
      lessonService.closeLesson();
    }
  } else {
    if (!isLessonCompleted) {
      // For web, abortSequence happens in unload handler in TrainersSequence;
    }
    dispatch(navigateToReturnUrl());
  }
};

export const preparePurge = (): AppThunk => (dispatch, getState) => {
  const event = lessonSessionEvents.lessonSessionStartedPurgeEvent(getState());
  return dispatch(track(event));
};
