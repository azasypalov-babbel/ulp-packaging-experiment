import lessonService from '../../src/services/lesson/default';
import demoLessonService from '../../src/services/lesson/mock';

jest.mock('../../src/services/awsApiClient');

describe('Lesson Service Mock', () => {
  describe('lessonService interface', () => {
    it('should mock all the methods of the lessonService', () => {
      const serviceMethods = new Set(Object.keys(lessonService));
      const mockMethods = new Set(Object.keys(demoLessonService));

      const diff = new Set(Array.from(serviceMethods).filter((m) => !mockMethods.has(m)));

      expect(diff.size).toBe(0);
    });
  });

  describe('#getLessonData', () => {
    describe('when translationVisibility URL parameter is NOT set', () => {
      let actualVisibilities;

      beforeEach(() => {
        actualVisibilities = demoLessonService.getLessonData({ lessonUuid: 'composite-one' })
          .then((data) => {
            return data.lesson.trainers.map((t) => {
              return t.translation_visibility;
            });
          });
      });

      it('should have translation_visibility as specified in the demo lesson object', () => {
        const expectedVisibilities = ['none', 'full', 'full'];
        return expect(actualVisibilities).resolves.toEqual(expectedVisibilities);
      });
    });

    describe('when translationVisibility URL parameter is set', () => {
      describe('when translationVisibility URL parameter is NOT set to an allowed string value', () => {
        let actualVisibilities;

        beforeEach(() => {
          jest.spyOn(URLSearchParams.prototype, 'get').mockImplementationOnce(() => 'not-allowed-value');
          actualVisibilities = demoLessonService.getLessonData({ lessonUuid: 'composite-one' })
            .then((data) => {
              return data.lesson.trainers.map((t) => {
                return t.translation_visibility;
              });
            });
        });

        it('should have translation_visibility as specified in the demo lesson object', () => {
          const expectedVisibilities = ['none', 'full', 'full'];
          return expect(actualVisibilities).resolves.toEqual(expectedVisibilities);
        });
      });

      describe('when translationVisibility URL parameter is set to an allowed string value, for example full', () => {
        let actualVisibilities;

        beforeEach(() => {
          jest.spyOn(URLSearchParams.prototype, 'get').mockImplementationOnce(() => 'full');
          actualVisibilities = demoLessonService.getLessonData({ lessonUuid: 'composite-one' })
            .then((data) => {
              return data.lesson.trainers.map((t) => {
                return t.translation_visibility;
              });
            });
        });

        it('should have translation_visibility "full"', () => {
          const expectedVisibilities = ['full', 'full', 'full'];
          return expect(actualVisibilities).resolves.toEqual(expectedVisibilities);
        });
      });
    });
  });
});
