/* eslint-disable camelcase */
import * as lessonTypes from '../../../src/dux/lesson/types';
import * as contentTypes from '../../../src/dux/content/types';
import * as sequenceTypes from '../../../src/dux/sequence/types';
import * as contentActions from '../../../src/dux/content/actions';
import * as contentReleaseTypes from '../../../src/dux/contentRelease/types';
import * as contentReleaseActions from '../../../src/dux/contentRelease/actions';
import * as lessonActions from '../../../src/dux/lesson/actions';
import * as sequenceActions from '../../../src/dux/sequence/actions';
import { isLesson } from '../../../src/dux/session/selectors';
import { isFirstTrainerWithAutoplay } from '../../../src/dux/sequence/selectors';
import { trainersContainSpeakInteraction } from '../../../src/lib/speechHelper';

import lessonMiddleware from '../../../src/dux/lesson/middleware';
import * as trainerItemsStrategy from '../../../src/lib/trainerItemsStrategy';
import { AnyAction, CombinedState } from 'redux';
import { RootState } from '@src/store';

jest.mock('../../../src/dux/contentRelease/actions', () => ({
  setContentReleaseId: jest.fn(() => ({ type: 'mock-set-content-release-id-action-type' })),
  fetchContentRelease: jest.fn(() => ({ type: 'mock-fetch-content-release-action-type' }))
}));

jest.mock('../../../src/dux/content/actions', () => ({
  fetchLearnLanguage: jest.fn(() => ({ type: 'mock-fetch-learn-language-action-type' }))
}));

jest.mock('../../../src/dux/lesson/actions', () => ({
  completeLesson: jest.fn(() => ({ type: 'mock-complete-lesson-action-type' })),
  preparePurge: jest.fn(() => ({ type: 'mock-prepare-purge-action-type' })),
  fetchLessonData: jest.fn(() => ({ type: 'mock-fetch-lesson-data-action-type' }))
}));

jest.mock('../../../src/dux/sequence/actions', () => ({
  init: jest.fn(() => ({ type: 'mock-sequence-init-type' })),
  startSequence: jest.fn(() => ({ type: 'mock-start-sequence-type' }))
}));

jest.mock('../../../src/lib/features.js', () => ({
  get: jest.fn(() => ({})),
  isWebview: jest.fn()
}));

jest.mock('../../../src/services/rollbarService', () => ({
  log: jest.fn()
}));

jest.mock('../../../src/dux/session/selectors', () => ({
  isLesson: jest.fn(() => true)
}));
const mockIsLesson = isLesson as jest.MockedFunction<typeof isLesson>;

jest.mock('../../../src/dux/sequence/selectors', () => ({
  isFirstTrainerWithAutoplay: jest.fn(() => true)
}));
const mockIsFirstTrainerWithAutoplay = isFirstTrainerWithAutoplay as jest.MockedFunction<typeof isFirstTrainerWithAutoplay>;

jest.mock('../../../src/lib/speechHelper', () => ({
  trainersContainSpeakInteraction: jest.fn(() => true)
}));
const mockTrainersContainSpeakInteraction = trainersContainSpeakInteraction as jest.MockedFunction<typeof trainersContainSpeakInteraction>;

const create = () => {
  const store = {
    getState: jest.fn(() => ({
      lesson: {},
      experiments: {},
      sequence: {},
      session: {},
      contentRelease: {
        data: {}
      }
    } as CombinedState<RootState>)),
    dispatch: jest.fn()
  };

  const next = jest.fn();

  const invoke = (action: AnyAction) => lessonMiddleware(store)(next)(action);

  return { store, next, invoke };
};

describe('Lesson Middleware', () => {
  describe('when not in lesson', () => {
    beforeEach(() => {
      mockIsLesson.mockImplementationOnce(() => false);
    });

    afterEach(() => {
      mockIsLesson.mockClear();
    });

    it('passes through the action', () => {
      const { next, invoke } = create();
      const action = { type: sequenceTypes.COMPLETE_SEQUENCE };
      invoke(action);
      expect(next).toHaveBeenCalledWith(action);
    });

    it('does not dispatch anything else', () => {
      const { store, invoke } = create();
      const action = { type: sequenceTypes.COMPLETE_SEQUENCE };
      invoke(action);
      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('for a FETCH_LESSON_DATA_FULFILLED action', () => {
    const mapTrainerTypeInteractionSpy = jest.spyOn(trainerItemsStrategy, 'mapTrainerTypeInteraction')
      .mockImplementation((trainers) => trainers);
    const filterWhitelistedTrainersSpy = jest.spyOn(trainerItemsStrategy, 'filterWhitelistedTrainers')
      .mockImplementation((trainers) => trainers);
    const defaultLesson = {
      id: 'test-vocabulary',
      trainers: [{
        type: 'vocabulary',
        item_groups: [{
          items: [{
            a: 1,
            b: 2
          }]
        }]
      }]
    };

    it('passes through the action', () => {
      const { next, invoke } = create();
      const action = {
        type: `${lessonTypes.FETCH_LESSON_DATA}_FULFILLED`,
        payload: {
          lesson: defaultLesson
        }
      };
      invoke(action);

      expect(next).toHaveBeenCalledWith(action);
    });

    it('modifies lesson with transformed trainers', () => {
      const { next, invoke } = create();

      const FIXTURE_INPUT = [{ type: 'input', item_groups: defaultLesson.trainers[0].item_groups }];
      const FIXTURE_FILTERED = [{ type: 'filtered', item_groups: defaultLesson.trainers[0].item_groups }];
      const FIXTURE_MAPPED = [{
        type: 'mapped_type',
        interaction: 'mapped_interaction',
        item_groups: defaultLesson.trainers[0].item_groups
      }];

      filterWhitelistedTrainersSpy.mockImplementationOnce(() => FIXTURE_FILTERED);
      mapTrainerTypeInteractionSpy.mockImplementationOnce(() => FIXTURE_MAPPED);

      const action = {
        type: `${lessonTypes.FETCH_LESSON_DATA}_FULFILLED`,
        payload: {
          lesson: {
            id: 'test',
            trainers: FIXTURE_INPUT
          }
        }
      };

      const enhancedAction = {
        type: `${lessonTypes.FETCH_LESSON_DATA}_FULFILLED`,
        payload: {
          lesson: {
            id: 'test',
            trainers: FIXTURE_FILTERED
          }
        }
      };

      invoke(action);

      expect(mapTrainerTypeInteractionSpy).toHaveBeenCalledWith(FIXTURE_INPUT);
      expect(filterWhitelistedTrainersSpy).toHaveBeenCalledWith(FIXTURE_MAPPED);
      expect(next).toHaveBeenCalledWith(enhancedAction);
    });

    it('should dispatch init sequence action', () => {
      const { store, invoke } = create();
      const action = {
        type: `${lessonTypes.FETCH_LESSON_DATA}_FULFILLED`,
        payload: {
          lesson: defaultLesson
        }
      };

      invoke(action);
      expect(sequenceActions.init).toHaveBeenCalledWith(action.payload.lesson.trainers);
      expect(store.dispatch).toHaveBeenCalledWith({ type: 'mock-sequence-init-type' });
    });

    describe('starts the sequence', () => {
      describe('when sequence does not start with an autoplay trainer', () => {
        beforeEach(() => {
          mockIsFirstTrainerWithAutoplay.mockImplementationOnce(() => false);
        });

        afterEach(() => {
          mockIsFirstTrainerWithAutoplay.mockClear();
        });

        describe('when sequence contains a speaking trainer', () => {
          test('should not dispatch start sequence action', () => {
            const { store, invoke } = create();
            const action = {
              type: `${lessonTypes.FETCH_LESSON_DATA}_FULFILLED`,
              payload: {
                lesson: defaultLesson
              }
            };

            invoke(action);
            expect(sequenceActions.startSequence).not.toHaveBeenCalled();
            expect(store.dispatch).not.toHaveBeenCalledWith({ type: 'mock-start-sequence-type' });
          });
        });

        describe('when sequence does not contain a speaking trainer', () => {
          beforeEach(() => {
            mockTrainersContainSpeakInteraction.mockImplementationOnce(() => false);
          });

          afterEach(() => {
            mockTrainersContainSpeakInteraction.mockClear();
          });

          test('should dispatch start sequence action', () => {
            const { store, invoke } = create();
            const action = {
              type: `${lessonTypes.FETCH_LESSON_DATA}_FULFILLED`,
              payload: {
                lesson: defaultLesson
              }
            };

            invoke(action);
            expect(sequenceActions.startSequence).toHaveBeenCalled();
            expect(store.dispatch).toHaveBeenCalledWith({ type: 'mock-start-sequence-type' });
          });
        });
      });

      describe('when sequence starts with an autoplay trainer', () => {
        beforeEach(() => {
          mockIsFirstTrainerWithAutoplay.mockImplementationOnce(() => true);
        });

        afterEach(() => {
          mockIsFirstTrainerWithAutoplay.mockClear();
        });

        test('should not dispatch start sequence action', () => {
          const { store, invoke } = create();
          const action = {
            type: `${lessonTypes.FETCH_LESSON_DATA}_FULFILLED`,
            payload: {
              lesson: defaultLesson
            }
          };

          invoke(action);
          expect(sequenceActions.startSequence).not.toHaveBeenCalled();
          expect(store.dispatch).not.toHaveBeenCalledWith({ type: 'mock-start-sequence-type' });
        });
      });
    });
  });

  describe('for LESSON/INIT_LESSON action', () => {
    it('passes through the action', () => {
      const { next, invoke } = create();
      const action = {
        type: lessonTypes.INIT_LESSON,
        payload: {}
      };

      invoke(action);

      expect(next).toHaveBeenCalledWith(action);
    });

    describe('when content release id is provided', () => {
      it('sets content release id', () => {
        const { store, invoke } = create();
        const action = {
          type: lessonTypes.INIT_LESSON,
          payload: {
            contentReleaseId: 'foo'
          }
        };

        invoke(action);

        expect(contentReleaseActions.setContentReleaseId).toHaveBeenCalled();
        expect(store.dispatch).toHaveBeenCalledWith({
          type: 'mock-set-content-release-id-action-type'
        });
      });
    });

    describe('when content release id is NOT provided', () => {
      it('fetches content release id', () => {
        const { store, invoke } = create();
        const action = {
          type: lessonTypes.INIT_LESSON,
          payload: {}
        };

        invoke(action);

        expect(contentReleaseActions.fetchContentRelease).toHaveBeenCalled();
        expect(store.dispatch).toHaveBeenCalledWith({
          type: 'mock-fetch-content-release-action-type'
        });
      });
    });
  });

  describe('once content release id is ready', () => {
    describe('for CONTENT_RELEASE/SET_CONTENT_RELEASE_ID action', () => {
      const action = {
        type: contentReleaseTypes.SET_CONTENT_RELEASE_ID
      };

      it('passes through the action', () => {
        const { next, invoke } = create();
        invoke(action);

        expect(next).toHaveBeenCalledWith(action);
      });

      const { store, invoke } = create();

      it('fetches learn language', () => {
        invoke(action);

        expect(contentActions.fetchLearnLanguage).toHaveBeenCalled();
        expect(store.dispatch).toHaveBeenCalledWith({
          type: 'mock-fetch-learn-language-action-type'
        });
      });
    });

    describe('for CONTENT_RELEASE/FETCH_CONTENT_RELEASE_FULFILLED action', () => {
      const action = {
        type: `${contentReleaseTypes.FETCH_CONTENT_RELEASE}_FULFILLED`
      };

      it('passes through the action', () => {
        const { next, invoke } = create();
        invoke(action);

        expect(next).toHaveBeenCalledWith(action);
      });

      const { store, invoke } = create();

      it('fetches learn language', () => {
        invoke(action);

        expect(contentActions.fetchLearnLanguage).toHaveBeenCalled();
        expect(store.dispatch).toHaveBeenCalledWith({
          type: 'mock-fetch-learn-language-action-type'
        });
      });
    });
  });

  describe('for SEQUENCE/COMPLETE_SEQUENCE action', () => {
    const action = {
      type: sequenceTypes.COMPLETE_SEQUENCE
    };

    it('passes through the action', () => {
      const { next, invoke } = create();
      invoke(action);

      expect(next).toHaveBeenCalledWith(action);
    });

    describe('when in lesson', () => {
      const { store, invoke } = create();
      beforeEach(() => {
        store.getState.mockImplementation(() => ({
          sequence: {
            purgeLoopsCounter: 1,
          }
        } as CombinedState<RootState>));
      });

      afterEach(() => {
        store.getState.mockClear();
      });

      it('completes lesson', () => {
        invoke(action);

        expect(lessonActions.completeLesson).toHaveBeenCalled();
        expect(store.dispatch).toHaveBeenCalledWith({
          type: 'mock-complete-lesson-action-type'
        });
      });
    });

    describe('when in purge', () => {
      const { store, invoke } = create();
      beforeEach(() => {
        store.getState.mockImplementation(() => ({
          sequence: {
            purgeLoopsCounter: 2
          }
        } as CombinedState<RootState>));
      });
      afterEach(() => {
        store.getState.mockClear();
      });

      it('does not complete lesson', () => {
        invoke(action);

        expect(lessonActions.completeLesson).not.toHaveBeenCalled();
      });
    });
  });

  describe('for SEQUENCE/PREPARE_PURGE action', () => {
    it('passes through the action', () => {
      const { next, invoke } = create();
      const action = {
        type: sequenceTypes.PREPARE_PURGE
      };

      invoke(action);

      expect(next).toHaveBeenCalledWith(action);
    });

    it('completes review', () => {
      const { store, invoke } = create();
      const action = {
        type: sequenceTypes.PREPARE_PURGE
      };

      invoke(action);

      expect(lessonActions.preparePurge).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith({
        type: 'mock-prepare-purge-action-type'
      });
    });
  });

  describe('for another action', () => {
    it('passes through the action', () => {
      const { next, invoke } = create();
      const action = { type: 'FOO' };
      invoke(action);
      expect(next).toHaveBeenCalledWith(action);
    });

    it('does not dispatch anything else', () => {
      const { store, invoke } = create();
      const action = { type: 'FOO' };
      invoke(action);
      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('for CONTENT/FETCH_LEARN_LANGUAGE_FULFILLED action', () => {
    it('passes through the action', () => {
      const { next, invoke } = create();
      const action = {
        type: `${contentTypes.FETCH_LEARN_LANGUAGE}_FULFILLED`
      };

      invoke(action);

      expect(next).toHaveBeenCalledWith(action);
    });

    it('fetches lesson data', () => {
      const { store, invoke } = create();
      const action = {
        type: `${contentTypes.FETCH_LEARN_LANGUAGE}_FULFILLED`
      };

      invoke(action);

      expect(lessonActions.fetchLessonData).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith({
        type: 'mock-fetch-lesson-data-action-type'
      });
    });
  });
});
