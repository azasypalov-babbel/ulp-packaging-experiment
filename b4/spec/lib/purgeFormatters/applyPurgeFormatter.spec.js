import * as trainerFormatters from '../../../src/lib/purgeFormatters/trainerFormatters';
import applyPurgeFormatter from '../../../src/lib/purgeFormatters/applyPurgeFormatter';

describe('#purgeFormatters', () => {
  describe('#applyPurgeFormatter', () => {
    beforeEach(() => {
      jest.spyOn(trainerFormatters, 'removeCorrectItems');
      jest.spyOn(trainerFormatters, 'makeCorrectItemsNonInteractive');
      jest.spyOn(trainerFormatters, 'makeUnattemptedItemsNonInteractive');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    ['dialog', 'card'].forEach((trainerType) => {
      describe(`when trainer type is '${trainerType}'`, () => {
        test('mark unattempted items and correct items as non interactive', () => {
          const trainer = {
            type: trainerType,
            item_groups: [{ items: [{ attempt: { mistakes: 1 } }] }]
          };

          applyPurgeFormatter(trainer);

          expect(trainerFormatters.makeUnattemptedItemsNonInteractive).toHaveBeenCalled();
          expect(trainerFormatters.makeCorrectItemsNonInteractive).toHaveBeenCalled();
        });
      });
    });

    ['vocabulary', 'flashcard', 'dictate', 'matching'].forEach((trainerType) => {
      describe(`when trainer type is '${trainerType}'`, () => {
        test('remove correct items', () => {
          const trainer = {
            type: trainerType,
            item_groups: [{ items: [{ attempt: { mistakes: 1 } }] }]
          };

          applyPurgeFormatter(trainer);

          expect(trainerFormatters.removeCorrectItems).toHaveBeenCalled();
        });
      });
    });

    describe('when there is no formatter for trainer', () => {
      test('formatted trainer should be null', () => {
        const trainer = {
          type: 'unknown-trainer-type',
          item_groups: [{ items: [{ attempt: { mistakes: 1 } }] }]
        };

        const formattedTrainer = applyPurgeFormatter(trainer);

        expect(formattedTrainer).toBe(null);
      });
    });

    describe('when trainer has not been attempted', () => {
      test('formatted trainer should be null', () => {
        const trainer = {
          type: 'vocabulary',
          item_groups: [
            { items: [{ id: '1' }] },
            { items: [{ id: '2' }] }
          ]
        };

        const formattedTrainer = applyPurgeFormatter(trainer);

        expect(formattedTrainer).toBe(null);
      });
    });
  });
});
