import nativeLessonService from '../../src/services/lesson/native';
import { setupMethodMock } from '../lib/nativeBridgeTestHelpers';

describe('NativeLessonService bridge', () => {
  const name = 'lesson';

  describe('the bridge', () => {
    it(`is called '${name}'`, () => {
      expect(nativeLessonService.name).toEqual(name);
    });
  });

  describe('methods that fetch static data from native', () => {
    beforeEach(() => {
      jest.spyOn(document, 'querySelector');
      document.querySelector.mockReturnValue({ text: '{ "lesson": { "id": "lessonId" } }' });
    });

    afterEach(() => {
      document.querySelector.mockRestore();
    });

    describe('#getLessonData', () => {
      it('returns lesson data', () => {
        const expectedLesson = {
          lesson: { id: 'lessonId' }
        };

        return expect(nativeLessonService.getLessonData({
          learnLanguageAlpha3: 'FRA',
          locale: 'en',
          lessonUuid: 'lessonUuid',
          learningActivityId: 'learningActivityId',
          contentReleaseId: 'contentReleaseId'
        })).resolves.toEqual(expectedLesson);
      });
    });
  });

  describe('the interface with native', () => {
    const expectedMessageBase = {
      payload: {
        lesson: {
          id: 'learningActivityId',
          title: '',
          include: {
            id: 'lessonUuid'
          }
        },
        courseOverview: {
          id: 'courseOverviewId'
        },
        course: {
          id: 'courseId'
        },
        contentRelease: {
          learnLanguageAlpha3: 'FRA',
          locale: 'en',
          id: '1234'
        }
      }
    };

    describe('methods that trigger the execution of native iOS code', () => {
      const getMessage = setupMethodMock();

      describe('web calls closeLesson()', () => {
        it('should post a message to native', () => {
          nativeLessonService.closeLesson();

          const expectedMessage = {
            type: 'lesson/END',
            payload: {}
          };

          expect(getMessage()).toEqual(expectedMessage);
        });
      });

      describe('web calls postLessonCompleted()', () => {
        it('should post a message to native', () => {
          nativeLessonService.postLessonCompleted({
            lessonUuid: 'lessonUuid',
            learningActivityId: 'learningActivityId',
            courseId: 'courseId',
            courseOverviewId: 'courseOverviewId',
            contentReleaseId: '1234',
            learnLanguageAlpha3: 'FRA',
            locale: 'en'
          });

          const expectedMessage = {
            ...expectedMessageBase,
            type: 'lesson/COMPLETE',
            payload: {
              ...expectedMessageBase.payload,
              lesson: {
                ...expectedMessageBase.payload.lesson,
                completed: true
              }
            }
          };

          expect(getMessage()).toEqual(expectedMessage);
        });
      });

      describe('web calls postLessonAbort', () => {
        it('should post message to native', () => {
          nativeLessonService.postLessonAbort({
            lessonUuid: 'lessonUuid',
            learningActivityId: 'learningActivityId',
            courseId: 'courseId',
            courseOverviewId: 'courseOverviewId',
            contentReleaseId: '1234',
            learnLanguageAlpha3: 'FRA',
            locale: 'en'
          });

          const expectedMessage = {
            ...expectedMessageBase,
            type: 'lesson/ABORT',
            payload: {
              ...expectedMessageBase.payload,
              lesson: {
                ...expectedMessageBase.payload.lesson,
                completed: false
              }
            }
          };

          expect(getMessage()).toEqual(expectedMessage);
        });
      });
    });

    describe('messages from the native iOS application to the lesson-player', () => {
      it('does not support any', () => {
        expect(nativeLessonService.events).toEqual([]);
      });
    });
  });
});
