import mockStore from '../mockStore';
import * as lessonTypes from '../../../src/dux/lesson/types';
import * as lessonActions from '../../../src/dux/lesson/actions';
import services from '../../../src/services';
import * as lessonSessionEvents from '../../../src/dux/tracker/events/lessonSession';
import * as trackingActions from '../../../src/dux/tracker/actions';
import { isWebview } from '../../../src/lib/features';

const {lessonService} = services;
const trackingActionsSpy = jest.spyOn(trackingActions, 'track');

jest.mock('../../../src/dux/session/actions', () => ({
  navigateToReturnUrl: jest.fn(() => ({ type: 'SESSION/NAVIGATE_TO_RETURN_URL' }))
}));

jest.mock('../../../src/services/lesson/default', () => ({
  getLessonData: jest.fn(() => Promise.resolve({
    lesson: 'some-lesson-data'
  })),
  postLessonCompleted: jest.fn(() => Promise.resolve()),
  postLessonAbort: jest.fn(() => Promise.resolve()),
  closeLesson: jest.fn(() => undefined)
}));
const mockLessonService = lessonService as jest.Mocked<typeof lessonService>;

jest.mock('../../../src/dux/sequence/selectors', () => ({
  currentTrainer: jest.fn(() => ({}))
}));
jest.mock('../../../src/services/trackingService', () => ({
  track: jest.fn().mockResolvedValue({})
}));
jest.mock('../../../src/dux/tracker/events/lessonSession', () => ({
  lessonSessionEndedFinishEvent: jest.fn().mockReturnValue({ event: 'lesson_session:ended:finish' }),
  lessonSessionEndedAbortEvent: jest.fn().mockReturnValue({ event: 'lesson_session:ended:abort' }),
  lessonSessionStartedPurgeEvent: jest.fn().mockReturnValue({ event: 'lesson_session:started:purge' })
}));

jest.mock('../../../src/lib/features');
const mockIsWebview = isWebview as jest.MockedFunction<typeof isWebview>;

const getStateMock = jest.fn();

describe('lesson actions', () => {
  const mockCourse = {
    id: 'courseId1',
    lessons: [
      { id: '456' }
    ]
  };

  const mockCourseOverview = {
    id: 'courseOverviewId1',
    courses: [
      mockCourse
    ]
  };

  const state = {
    account: {
      account: {
        uuid: '2'
      }
    },
    lesson: {
      lessonUuid: '123',
      learningActivityId: '456'
    },
    session: {
      locale: 'en',
      learnLanguageAlpha3: 'FRA',
      type: 'LESSON'
    },
    contentRelease: {
      data: {
        id: 'fake-content-release-id'
      }
    },
    content: {
      data: {
        courseOverviews: [
          mockCourseOverview
        ]
      }
    },
    sequence: {}
  };
  getStateMock.mockImplementation(() => state);

  const store = mockStore(getStateMock);

  afterEach(() => {
    trackingActionsSpy.mockClear();
    store.clearActions();
  });

  describe('fetchLessonData', () => {
    afterEach(() => {
      mockLessonService.getLessonData.mockClear();
    });

    test('calls lesson service', () => {
      expect.assertions(1);

      return store.dispatch(lessonActions.fetchLessonData())
        .then(() => {
          expect(lessonService.getLessonData).toHaveBeenCalledWith({
            contentReleaseId: 'fake-content-release-id',
            locale: state.session.locale,
            learnLanguageAlpha3: state.session.learnLanguageAlpha3,
            lessonUuid: state.lesson.lessonUuid,
            learningActivityId: state.lesson.learningActivityId
          });
        });
    });

    test('dispatches async middleware actions', () => {
      expect.assertions(2);

      return store.dispatch(lessonActions.fetchLessonData()).then(() => {
        expect(store.getActions()).toContainEqual(expect.objectContaining({
          type: `${lessonTypes.FETCH_LESSON_DATA}_PENDING`
        }));
        expect(store.getActions()).toContainEqual(expect.objectContaining({
          type: `${lessonTypes.FETCH_LESSON_DATA}_FULFILLED`,
          payload: { lesson: 'some-lesson-data' }
        }));
      });
    });
  });

  describe('completeLesson', () => {
    afterEach(() => {
      mockLessonService.postLessonCompleted.mockClear();
    });

    test('calls services', () => {
      expect.assertions(2);

      const expectedActionTypes = [
        `${lessonTypes.COMPLETE_LESSON}_PENDING`,
        `${lessonTypes.POST_LESSON_COMPLETE}_PENDING`,
        `${lessonTypes.POST_LESSON_COMPLETE}_FULFILLED`,
        `${lessonTypes.COMPLETE_LESSON}_FULFILLED`
      ];

      return store.dispatch(lessonActions.completeLesson())
        .then(() => {
          const actionTypes = store.getActions().map((action) => action.type);

          expect(actionTypes).toEqual(expect.arrayContaining(expectedActionTypes));

          expect(lessonService.postLessonCompleted).toHaveBeenCalledWith({
            contentReleaseId: 'fake-content-release-id',
            locale: state.session.locale,
            learnLanguageAlpha3: state.session.learnLanguageAlpha3,
            lessonUuid: state.lesson.lessonUuid,
            learningActivityId: state.lesson.learningActivityId,
            courseId: state.content.data.courseOverviews[0].courses[0].id,
            courseOverviewId: state.content.data.courseOverviews[0].id
          });
        });
    });
  });

  describe('#closeLesson', () => {
    test('emits close lesson', () => {
      store.dispatch(lessonActions.closeLesson());

      expect(store.getActions()).toContainEqual(
        expect.objectContaining({
          type: 'LESSON/CLOSE_LESSON'
        })
      );
    });
    describe('when in Webview', () => {
      beforeEach(() => {
        mockIsWebview.mockImplementationOnce(() => true);
      });

      describe('when the lesson is completed', () => {
        beforeEach(() => {
          getStateMock.mockImplementationOnce(() => ({
            sequence: { completed: true }
          }));
        });
        test('sends post native message', async () => {
          await store.dispatch(lessonActions.closeLesson());

          expect(mockLessonService.closeLesson).toHaveBeenCalled();
        });
      });
      describe('when the lesson is not completed', () => {
        beforeEach(() => {
          getStateMock.mockImplementationOnce(() => ({
            sequence: { completed: false }
          }));
        });
        test('sends abort sequence action', async () => {
          await store.dispatch(lessonActions.closeLesson());

          const actionTypes = store.getActions().map((action) => action.type);
          expect(actionTypes).toEqual(expect.arrayContaining(
            ['SEQUENCE/ABORT_SEQUENCE']
          ));
        });
        test('sends post native aborted', async () => {
          await store.dispatch(lessonActions.closeLesson());

          expect(mockLessonService.postLessonAbort).toHaveBeenCalled();
        });
      });
    });

    describe('when NOT in Webview', () => {
      beforeEach(() => {
        mockIsWebview.mockImplementationOnce(() => false);
      });

      describe('when the lesson is completed', () => {
        beforeEach(() => {
          getStateMock.mockImplementationOnce(() => ({
            sequence: { completed: true }
          }));
        });

        test('dispatch navigateToReturnUrl session action', async () => {
          const expectedActionTypes = [
            'SESSION/NAVIGATE_TO_RETURN_URL'
          ];

          await store.dispatch(lessonActions.closeLesson());
          const actionTypes = store.getActions().map((action) => action.type);

          expect(actionTypes).toEqual(expect.arrayContaining(expectedActionTypes));
        });
      });

      describe('when the lesson is not completed', () => {
        beforeEach(() => {
          getStateMock.mockImplementationOnce(() => ({
            sequence: { completed: false }
          }));
        });

        /**
         * On web, abort sequence will be triggered when the page navigates away
         * from the lesson-player. This will happen following the navigation to return url.
         */
        test('does not send abort sequence action', async () => {
          await store.dispatch(lessonActions.closeLesson());

          const actionTypes = store.getActions().map((action) => action.type);
          expect(actionTypes).not.toEqual(expect.arrayContaining(
            ['SEQUENCE/ABORT_SEQUENCE']
          ));
        });

        test('dispatch navigateToReturnUrl session action', () => {
          const expectedActionTypes = [
            'SESSION/NAVIGATE_TO_RETURN_URL'
          ];

          store.dispatch(lessonActions.closeLesson());
          const actionTypes = store.getActions().map((action) => action.type);

          expect(actionTypes).toEqual(expect.arrayContaining(expectedActionTypes));
        });
      });
    });
  });

  describe('preparePurge', () => {
    test('sends lesson session tracking event', () => {
      expect.assertions(2);

      return store.dispatch(lessonActions.preparePurge()).then(() => {
        expect(lessonSessionEvents.lessonSessionStartedPurgeEvent).toHaveBeenCalled();
        expect(trackingActions.track).toHaveBeenCalledWith({ event: 'lesson_session:started:purge' });
      });
    });
  });
});
