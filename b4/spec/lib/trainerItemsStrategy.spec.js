import {
  applyReviewTrainersStrategy,
  mapTrainerTypeInteraction,
  logIncorrectItemsToRollbar
} from '../../src/lib/trainerItemsStrategy';
import * as rollbarService from '../../src/services/rollbarService';
import {
  defaultStateDataLessonTest,
  defaultLessonLessonTest,
  defaultStateDataReviewTest,
  defaultLessonReviewTest,
  expectedParamsLessonTest,
  expectedParamsReviewTest,
  inputLessonDataVocabularyFillin,
  inputLessonDataMatchingType2,
  inputReviewData,
  expectedRollbarData
} from './trainerItemsStrategyRollbarTestData';

jest.mock('../../src/services/rollbarService', () => ({
  warn: jest.fn()
}));


/* eslint-disable max-len, camelcase */
const trainersOfLength = (length) => {
  return [{
    type: 'vocabulary',
    item_groups: [
      {
        items: Array(length).fill(null).map((_, i) => i)
      }
    ]
  }];
};

describe('#applyReviewTrainersStrategy', () => {
  describe('with 1 item', () => {
    test('results is an array of 1', () => {
      const trainers = trainersOfLength(1);
      const result = applyReviewTrainersStrategy(trainers);
      expect(result).toEqual([
        {
          type: 'vocabulary',
          item_groups: [
            {
              items: [0]
            }
          ]
        }
      ]);
    });
  });

  describe('with 2 items', () => {
    test('should result in array with 2', () => {
      const trainers = trainersOfLength(2);
      const result = applyReviewTrainersStrategy(trainers);
      expect(result).toEqual([
        {
          type: 'vocabulary',
          item_groups: [
            {
              items: [0, 1]
            }
          ]
        }
      ]);
    });
  });

  describe('with 5 items', () => {
    test('should result in 2 pages with 3 and 2 items', () => {
      const trainers = trainersOfLength(5);
      const result = applyReviewTrainersStrategy(trainers);
      expect(result).toEqual([
        {
          type: 'vocabulary',
          item_groups: [
            {
              items: [0, 1, 2]
            }
          ]
        },
        {
          type: 'vocabulary',
          item_groups: [
            {
              items: [3, 4]
            }
          ]
        }
      ]);
    });
  });

  describe('with 6 items', () => {
    test('should result in 2 pages with 3 and 3 items', () => {
      const trainers = trainersOfLength(6);
      const result = applyReviewTrainersStrategy(trainers);
      expect(result).toEqual([
        {
          type: 'vocabulary',
          item_groups: [
            {
              items: [0, 1, 2]
            }
          ]
        },
        {
          type: 'vocabulary',
          item_groups: [
            {
              items: [3, 4, 5]
            }
          ]
        }
      ]);
    });
  });

  describe('with 7 items', () => {
    test('should result in 2 pages with 3 and 4 items', () => {
      const trainers = trainersOfLength(7);
      const result = applyReviewTrainersStrategy(trainers);
      expect(result).toEqual([
        {
          type: 'vocabulary',
          item_groups: [
            {
              items: [0, 1, 2, 3]
            }
          ]
        },
        {
          type: 'vocabulary',
          item_groups: [
            {
              items: [4, 5, 6]
            }
          ]
        }
      ]);
    });
  });

  describe('with 8 items', () => {
    test('should result in 2 pages with 4 and 4 items', () => {
      const trainers = trainersOfLength(8);
      const result = applyReviewTrainersStrategy(trainers);
      expect(result).toEqual([
        {
          type: 'vocabulary',
          item_groups: [
            {
              items: [0, 1, 2, 3]
            }
          ]
        },
        {
          type: 'vocabulary',
          item_groups: [
            {
              items: [4, 5, 6, 7]
            }
          ]
        }
      ]);
    });
  });

  describe('with 9 items', () => {
    test('should result in 3 arrays with 3, 3 and 3', () => {
      const trainers = trainersOfLength(9);
      const result = applyReviewTrainersStrategy(trainers);
      expect(result).toEqual([
        {
          type: 'vocabulary',
          item_groups: [
            {
              items: [0, 1, 2]
            }
          ]
        },
        {
          type: 'vocabulary',
          item_groups: [
            {
              items: [3, 4, 5]
            }
          ]
        },
        {
          type: 'vocabulary',
          item_groups: [
            {
              items: [6, 7, 8]
            }
          ]
        }
      ]);
    });
  });

  describe('with 10 items', () => {
    test('should result in 3 arrays with 3, 3 and 4', () => {
      const trainers = trainersOfLength(10);
      const result = applyReviewTrainersStrategy(trainers);
      expect(result).toEqual([
        {
          type: 'vocabulary',
          item_groups: [
            {
              items: [0, 1, 2]
            }
          ]
        },
        {
          type: 'vocabulary',
          item_groups: [
            {
              items: [3, 4, 5]
            }
          ]
        },
        {
          type: 'vocabulary',
          item_groups: [
            {
              items: [6, 7, 8, 9]
            }
          ]
        }
      ]);
    });
  });
});

describe('#mapTrainerTypeInteraction', () => {
  describe('when the trainers include a trainer type-interaction comination that needs to be mapped', () => {
    test('should map "cube speak" to "vocabulary speak"', () => {
      const trainers = [
        { type: 'cube', interaction: 'speak' }
      ];

      expect(mapTrainerTypeInteraction(trainers)).toEqual([
        { type: 'vocabulary', interaction: 'speak' }
      ]);
    });

    test('should map "cube choose" to "vocabulary choose"', () => {
      const trainers = [
        { type: 'cube', interaction: 'choose' }
      ];

      expect(mapTrainerTypeInteraction(trainers)).toEqual([
        { type: 'vocabulary', interaction: 'choose' }
      ]);
    });

    test('should map "cube write" to "vocabulary write"', () => {
      const trainers = [
        { type: 'cube', interaction: 'write' }
      ];

      expect(mapTrainerTypeInteraction(trainers)).toEqual([
        { type: 'vocabulary', interaction: 'write' }
      ]);
    });

    test('should map "dictate sort" to "dictate wordorder"', () => {
      const trainers = [
        { type: 'dictate', interaction: 'sort' }
      ];

      expect(mapTrainerTypeInteraction(trainers)).toEqual([
        { type: 'dictate', interaction: 'wordorder' }
      ]);
    });

    test('should map "memory choose" to "vocabulary click"', () => {
      const trainers = [
        { type: 'memory', interaction: 'choose' }
      ];

      expect(mapTrainerTypeInteraction(trainers)).toEqual([
        { type: 'vocabulary', interaction: 'click' }
      ]);
    });

    test('should map "wordorder choose" to "vocabulary wordorder"', () => {
      const trainers = [
        { type: 'wordorder', interaction: 'choose' }
      ];

      expect(mapTrainerTypeInteraction(trainers)).toEqual([
        { type: 'vocabulary', interaction: 'wordorder' }
      ]);
    });
  });

  describe('when the trainer DOES NOT include a trainer type-interaction comination that needs to be mapped', () => {
    describe('when type does not match', () => {
      const trainers = [
        { type: 'some-type', interaction: 'speak' }
      ];

      test('should return the same trainer', () => {
        expect(mapTrainerTypeInteraction(trainers)).toEqual([
          { type: 'some-type', interaction: 'speak' }
        ]);
      });
    });

    describe('when interaction does not match', () => {
      const trainers = [
        { type: 'cube', interaction: 'some-interaction' }
      ];

      test('should return the same trainer', () => {
        expect(mapTrainerTypeInteraction(trainers)).toEqual([
          { type: 'cube', interaction: 'some-interaction' }
        ]);
      });
    });

    describe('when both type and interaction does not match', () => {
      const trainers = [
        { type: 'some-type', interaction: 'some-interaction' }
      ];

      test('should return the same trainer', () => {
        expect(mapTrainerTypeInteraction(trainers)).toEqual([
          { type: 'some-type', interaction: 'some-interaction' }
        ]);
      });
    });
  });
});

describe('#logIncorrectItemsToRollbar', () => {
  describe('when in lesson', () => {
    const expectedData = expectedParamsLessonTest;

    it('calls rollbar with expected parameters on encountering incorrect items', () => {
      logIncorrectItemsToRollbar(
        defaultLessonLessonTest.trainers,
        defaultStateDataLessonTest
      );

      expect(rollbarService.warn.mock.calls).toEqual(expect.arrayContaining(
        [[expectedData.expectedParamsError1.message, expectedData.expectedParamsError1.data]]
      ));
      expect(rollbarService.warn.mock.calls).toEqual(expect.arrayContaining(
        [[expectedData.expectedParamsError2.message, expectedData.expectedParamsError2.data]]
      ));
      expect(rollbarService.warn.mock.calls).toEqual(expect.arrayContaining(
        [[expectedData.expectedParamsError3.message, expectedData.expectedParamsError3.data]]
      ));
      expect(rollbarService.warn.mock.calls).toEqual(expect.arrayContaining(
        [[expectedData.expectedParamsError4.message, expectedData.expectedParamsError4.data]]
      ));
      expect(rollbarService.warn.mock.calls).toEqual(expect.arrayContaining(
        [[expectedData.expectedParamsError5.message, expectedData.expectedParamsError5.data]]
      ));
    });
  });

  describe('when in review', () => {
    const expectedData = expectedParamsReviewTest;

    it('calls rollbar with expected parameters on encountering incorrect items', () => {
      logIncorrectItemsToRollbar(
        defaultLessonReviewTest.trainers,
        defaultStateDataReviewTest
      );

      expect(rollbarService.warn.mock.calls).toEqual(expect.arrayContaining(
        [[expectedData.expectedParamsError1.message, expectedData.expectedParamsError1.data]]
      ));
      expect(rollbarService.warn.mock.calls).toEqual(expect.arrayContaining(
        [[expectedData.expectedParamsError2.message, expectedData.expectedParamsError2.data]]
      ));
      expect(rollbarService.warn.mock.calls).toEqual(expect.arrayContaining(
        [[expectedData.expectedParamsError3.message, expectedData.expectedParamsError3.data]]
      ));
      expect(rollbarService.warn.mock.calls).toEqual(expect.arrayContaining(
        [[expectedData.expectedParamsError4.message, expectedData.expectedParamsError4.data]]
      ));
      expect(rollbarService.warn.mock.calls).toEqual(expect.arrayContaining(
        [[expectedData.expectedParamsError5.message, expectedData.expectedParamsError5.data]]
      ));
    });
  });

  describe('with actual data from the demo page (vocab, matching type 2, review)', () => {
    it('works with vocab data', () => {
      logIncorrectItemsToRollbar(
        inputLessonDataVocabularyFillin.trainers,
        defaultStateDataLessonTest
      );

      expect(rollbarService.warn.mock.calls).toEqual(expect.arrayContaining(
        [[expectedRollbarData.lessonTrainerErrorVocabularyFillin.message, expectedRollbarData.lessonTrainerErrorVocabularyFillin.data]]
      ));
      expect(rollbarService.warn.mock.calls).toEqual(expect.arrayContaining(
        [[expectedRollbarData.lessonItemErrorVocabularyFillin.message, expectedRollbarData.lessonItemErrorVocabularyFillin.data]]
      ));
    });

    it('works with matching type 2 data', () => {
      logIncorrectItemsToRollbar(
        inputLessonDataMatchingType2.trainers,
        defaultStateDataLessonTest
      );

      expect(rollbarService.warn.mock.calls).toEqual(expect.arrayContaining(
        [[expectedRollbarData.lessonItem1ErrorMatchingType2.message, expectedRollbarData.lessonItem1ErrorMatchingType2.data]]
      ));
      expect(rollbarService.warn.mock.calls).toEqual(expect.arrayContaining(
        [[expectedRollbarData.lessonItem2ErrorMatchingType2.message, expectedRollbarData.lessonItem2ErrorMatchingType2.data]]
      ));
    });

    it('works with write review data', () => {
      logIncorrectItemsToRollbar(
        inputReviewData.trainers,
        defaultStateDataReviewTest
      );

      expect(rollbarService.warn.mock.calls).toEqual(expect.arrayContaining(
        [[expectedRollbarData.reviewTrainerError.message, expectedRollbarData.reviewTrainerError.data]]
      ));

      expect(rollbarService.warn.mock.calls).toEqual(expect.arrayContaining(
        [[expectedRollbarData.reviewItemError.message, expectedRollbarData.reviewItemError.data]])
      );
    });
  });
});
/* eslint-enable max-len, camelcase */
