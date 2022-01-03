import nativeReviewService from '../../src/services/nativeReviewService';
import { setupMethodMock } from '../lib/nativeBridgeTestHelpers';

describe('NativeReviewService bridge', () => {
  const name = 'review';
  describe('the bridge', () => {
    it(`is called '${name}'`, () => {
      expect(nativeReviewService.name).toEqual(name);
    });
  });

  describe('methods that fetch static data from native', () => {
    const dataStatic = {
      interaction_types: [
        { id: 'flashcard', count: 35 },
        { id: 'write', count: 35 }
      ],
      review_session: {
        next_url: 'foo',
        remaining_item_count: 2,
        trainers: [
          { type: 'cube', interaction: 'write', puzzle_helper: false }
        ]
      }
    };
    const urlParameters = {
      locale: 'DE',
      learnLanguageAlpha3: 'FRA',
      params: { filter: 'due' }
    };

    beforeEach(() => {
      jest.spyOn(document, 'querySelector');
      document.querySelector.mockReturnValue({ text: JSON.stringify(dataStatic) });
    });

    afterEach(() => {
      document.querySelector.mockRestore();
    });

    describe('#getReviewTypes()', () => {
      it('returns interaction types', () => {
        return expect(nativeReviewService.getReviewTypes(urlParameters)).resolves.toEqual(dataStatic.interaction_types);
      });
    });

    describe('#getReviewItems()', () => {
      it('returns review items', () => {
        return expect(nativeReviewService.getReviewItems(urlParameters)).resolves.toEqual(
          { review_session: dataStatic.review_session }
        );
      });
    });
  });

  describe('the interface with native', () => {
    describe('methods that trigger the execution of native iOS code', () => {
      const getMessage = setupMethodMock();

      describe('#updateVocabularyItems()', () => {
        const updateParams = {
          locale: 'DE',
          learnLanguageAlpha3: 'FRA',
          vocabularyItems: [{ foo: 'bar' }, { faz: 'baz' }]
        };

        const expectedMessage = {
          type: 'review/ITEM_COMPLETE',
          payload: {
            learnLanguageAlpha3: 'FRA',
            locale: 'DE',
            items: [{ foo: 'bar' }, { faz: 'baz' }]
          }
        };

        it('should post a message to native', () => {
          nativeReviewService.updateVocabularyItems(updateParams);
          expect(getMessage()).toEqual(expectedMessage);
        });
      });

      describe('#postReviewCompleted()', () => {
        const expectedMessage = {
          type: 'review/COMPLETE',
          payload: {}
        };

        it('should post a message to native', () => {
          nativeReviewService.postReviewCompleted();
          expect(getMessage()).toEqual(expectedMessage);
        });
      });

      describe('#postReviewAbort()', () => {
        const expectedMessage = {
          type: 'review/ABORT',
          payload: {}
        };

        it('should post a message to native', () => {
          nativeReviewService.postReviewAborted();
          expect(getMessage()).toEqual(expectedMessage);
        });
      });
    });

    describe('messages from the native iOS application to the lesson-player', () => {
      it('does not support any', () => {
        expect(nativeReviewService.events).toEqual([]);
      });
    });
  });
});
