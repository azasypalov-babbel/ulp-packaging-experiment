import * as types from './types';
import * as contentTypes from '../content/types';
import * as contentReleaseTypes from '../contentRelease/types';
import * as sequenceTypes from '../sequence/types';

import * as contentActions from '../content/actions';
import * as contentReleaseActions from '../contentRelease/actions';
import * as lessonActions from './actions';
import * as sequenceActions from '../sequence/actions';
import { compose } from '../../lib/compose';
import {
  mapTrainerTypeInteraction,
  filterWhitelistedTrainers,
  logIncorrectItemsToRollbar
} from '../../lib/trainerItemsStrategy';
import { isLesson } from '../session/selectors';
import { isFirstTrainerWithAutoplay } from '../sequence/selectors';
import { trainersContainSpeakInteraction } from '../../lib/speechHelper';
import services from '../../services';
import { AnyAction, Middleware } from 'redux';
import { RootState, TDispatch } from '@src/store';

const modifyTrainersInLesson = (modifier) => (lesson) => {
  return {
    ...lesson,
    trainers: modifier(lesson.trainers)
  };
};

const lesson: Middleware<
  Record<string, unknown>,
  RootState,
  TDispatch
> = (store) => (next) => (action: AnyAction) => {
  const enhancedAction = { ...action };
  const { dispatch, getState } = store;

  if (!isLesson(getState().session)) {
    return next(enhancedAction);
  }

  if (action.type === `${types.FETCH_LESSON_DATA}_FULFILLED`) {
    const enhancedLesson = compose(
      // the below modifiers are meant to support trainers' reduction
      modifyTrainersInLesson(filterWhitelistedTrainers),
      modifyTrainersInLesson(mapTrainerTypeInteraction)
    )(enhancedAction.payload.lesson);

    /* eslint-disable camelcase */
    const data = {
      locale: getState().session.locale,
      learn_language_alpha3: getState().session.learnLanguageAlpha3,
      content_uuid: enhancedLesson.id,
      // TODO: remove any typing from contentRelease after type decleration for contentRelease dux
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      content_release_id: (getState().contentRelease as any).data.id
    };
    /* eslint-enable camelcase */
    logIncorrectItemsToRollbar(enhancedLesson.trainers, data);

    enhancedAction.payload.lesson = enhancedLesson;

    dispatch(sequenceActions.init(enhancedAction.payload.lesson.trainers));

    const { sequence } = store.getState();
    if (!isFirstTrainerWithAutoplay(sequence)
      && !trainersContainSpeakInteraction(sequence.trainers, services.speechRecognitionService.getEngineName())) {
      dispatch(sequenceActions.startSequence());
    }
  }

  const result = next(enhancedAction);

  if (action.type === types.INIT_LESSON) {
    const { contentReleaseId } = action.payload;

    if (contentReleaseId) {
      dispatch(contentReleaseActions.setContentReleaseId(contentReleaseId));
    } else {
      dispatch(contentReleaseActions.fetchContentRelease());
    }
  }

  const isContentReleaseIdAvailable = [
    contentReleaseTypes.SET_CONTENT_RELEASE_ID,
    `${contentReleaseTypes.FETCH_CONTENT_RELEASE}_FULFILLED`
  ].includes(action.type);

  if (isContentReleaseIdAvailable) {
    dispatch(contentActions.fetchLearnLanguage());
  }

  if (action.type === `${contentTypes.FETCH_LEARN_LANGUAGE}_FULFILLED`) {
    dispatch(lessonActions.fetchLessonData());
  }

  if (action.type === sequenceTypes.COMPLETE_SEQUENCE && getState().sequence.purgeLoopsCounter === 1) {
    dispatch(lessonActions.completeLesson());
  }

  if (action.type === sequenceTypes.PREPARE_PURGE) {
    dispatch(lessonActions.preparePurge());
  }

  return result;
};

export default lesson;
