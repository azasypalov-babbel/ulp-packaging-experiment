import nativeContentService from '../../src/services/nativeContentService';
import { get } from '../../src/lib/features';
jest.mock('../../src/lib/features');

describe('NativeContentService bridge', () => {
  const name = 'content';

  describe('the bridge', () => {
    it(`is called '${name}'`, () => {
      expect(nativeContentService.name).toEqual(name);
    });
  });

  describe('methods that fetch static data from native', () => {
    const dataStatic = {
      learn_language: {
        unlocked: true,
        courseOverviews: [
          {
            courses: {
              id: 'test-course-id',
              title: 'Test Course 666',
              lessons: [
                {
                  completed: false,
                  id: 'test-uncompleted-lesson-id',
                  learnUnit: 'course',
                  title: '4712'
                },
                {}
              ]
            },
            id: 'test-course-overview-id',
            title: 'Test Course Overview 3000'
          },
          {}
        ]
      }
    };

    beforeEach(() => {
      jest.spyOn(document, 'querySelector');
      document.querySelector.mockReturnValue({ text: JSON.stringify(dataStatic) });
      get.mockImplementation(() => true);
    });

    afterEach(() => {
      document.querySelector.mockRestore();
    });

    describe('#fetchLearnLanguage', () => {
      it('returns content learn language data', () => {
        let received = Promise.resolve(nativeContentService.fetchLearnLanguage());
        return expect(received).resolves.toEqual(dataStatic.learn_language);
      });
    });
  });

  describe('the interface with native', () => {
    describe('methods that trigger the execution of native iOS code', () => {
      it('does not support any', () => {
        expect(nativeContentService.methods).toEqual([]);
      });
    });

    describe('messages from the native iOS application to the lesson-player', () => {
      it('does not support any', () => {
        expect(nativeContentService.events).toEqual([]);
      });
    });
  });
});
