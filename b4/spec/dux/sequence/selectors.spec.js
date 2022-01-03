import {
  correctItems,
  incorrectItems,
  purgeableItems,
  charactersFromItemGaps,
  containsSpeakInteraction,
  sequenceHeadIndex,
  calculateTrainerProgress,
  sequenceHeadProgress,
  currentTrainerItemIndex,
  isFirstTrainerWithAutoplay
} from '../../../src/dux/sequence/selectors';

import prepareTrainersForPurge from '../../../src/lib/purgeFormatters/prepareTrainersForPurge';
jest.mock('../../../src/lib/purgeFormatters/prepareTrainersForPurge');

jest.mock('../../../src/dux/sequence/trainersWithAutoplayList', () => ({
  trainersWithAutoplayList: [
    { type: 'trainer-with-autoplay' },
    {
      type: 'trainer-interaction-with-autoplay',
      interaction: 'interaction-with-autoplay'
    }
  ]
}));

const state = {
  trainers: [
    {
      type: 'memory',
      item_groups: [
        {
          items: [
            {
              id: 'correct-item',
              learn_language_text: 'foo',
              attempt: {
                mistakes: 0 // correct item, 3 points
              }
            },
            {
              id: 'unattempted-item',
              learn_language_text: 'foo',
              attempt: null
            }
          ]
        },
        {
          items: [
            {
              id: 'skipped-item',
              learn_language_text: 'foo',
              attempt: {
                skipped: true
              }
            },
            {
              id: 'mistaken-item',
              learn_language_text: 'foo',
              attempt: {
                mistakes: 2 // mistaken item, 1 point
              }
            },
            {
              id: 'other-mistaken-item',
              learn_language_text: 'foo',
              attempt: {
                mistakes: 1 // mistaken item, 2 points
              }
            }
          ]
        }
      ]
    }
  ]
};

describe('selectors', () => {
  describe('trainer progress', () => {
    const state = {
      trainers: [
        { completed: true },
        { expectedAttemptsCount: 2, item_groups: [{ items: [{ attempt: { mistakes: 2 } }, {}] }] },
        { expectedAttemptsCount: 1, item_groups: [{ items: [{}] }] },
        { expectedAttemptsCount: 0 }
      ]
    };

    test('should give progress 100 for trainers marked as completed', () => {
      expect(calculateTrainerProgress(state.trainers[0])).toEqual(1);
    });

    test('should calculate progress for trainers based on attempted items', () => {
      expect(calculateTrainerProgress(state.trainers[1])).toEqual(0.5);
      expect(calculateTrainerProgress(state.trainers[2])).toEqual(0);
    });

    test('should give 0 progress for trainers if no attempts expected', () => {
      expect(calculateTrainerProgress(state.trainers[3])).toEqual(0);
    });
  });

  describe('sequence head index', () => {
    const state = {
      trainers: [
        { completed: true },
        {
          expectedAttemptsCount: 2,
          item_groups: [
            { items: [{ attempt: { mistakes: 2 } }, { attempt: { mistakes: 2 } }] }
          ]
        },
        { expectedAttemptsCount: 1, item_groups: [{ items: [{}] }] },
        { expectedAttemptsCount: 0 }
      ]
    };

    it('should return first trainer in sequence that is not yet completed', () => {
      expect(sequenceHeadIndex(state)).toEqual(1);
    });

    describe('when all trainers are completed', () => {
      const state = {
        trainers: [
          { completed: true },
          { completed: true },
          { completed: true }
        ]
      };

      it('should return index of last trainer in sequence', () => {
        expect(sequenceHeadIndex(state)).toEqual(2);
      });
    });
  });

  describe('sequence head progress', () => {
    const state = {
      trainers: [
        { completed: true },
        { expectedAttemptsCount: 2, item_groups: [{ items: [{ attempt: { mistakes: 2 } }, {}] }] },
        { expectedAttemptsCount: 1, item_groups: [{ items: [{}] }] },
        { expectedAttemptsCount: 0 }
      ]
    };
    it('should return progress of trainer at head of sequence', () => {
      expect(sequenceHeadProgress(state)).toEqual(0.5);
    });
  });

  describe('correct/incorrect items', () => {
    test('returns the correct items in camel case', () => {
      expect(
        correctItems(state)
      ).toMatchObject([
        {
          id: 'correct-item',
          learnLanguageText: 'foo'
        }
      ]);
    });

    test('returns the mistaken items in camel case', () => {
      expect(
        incorrectItems(state)
      ).toMatchObject([
        {
          id: 'mistaken-item',
          learnLanguageText: 'foo'
        },
        {
          id: 'other-mistaken-item',
          learnLanguageText: 'foo'
        }
      ]);
    });
  });

  describe('purgeable items', () => {
    beforeEach(() => {
      prepareTrainersForPurge.mockImplementation((trainers) => trainers);
    });

    test('it returns the mistaken items from the purgeable trainers in camel case', () => {
      expect(
        purgeableItems(state)
      ).toMatchObject([
        {
          id: 'mistaken-item',
          learnLanguageText: 'foo'
        },
        {
          id: 'other-mistaken-item',
          learnLanguageText: 'foo'
        }
      ]);

      expect(prepareTrainersForPurge).toHaveBeenCalledWith(state.trainers);
    });
  });

  describe('#charactersFromItemGaps', () => {
    test('returns all unique characters from all the item gaps', () => {
      const state = {
        trainers: [
          {
            item_groups: [
              {
                items: [
                  {
                    id: 'correct-item',
                    learn_language_text: '((foo)) bar'
                  },
                  {
                    id: 'unattempted-item',
                    learn_language_text: '((baz)) ((zwo))'
                  }
                ]
              }
            ]
          }
        ]
      };

      expect(charactersFromItemGaps(state)).toEqual(['f', 'o', 'b', 'a', 'z', 'w']);
    });
  });

  describe('#containsSpeakInteraction', () => {
    describe('sequence does not contain speak interaction', () => {
      const state = {
        trainers: [{ interaction: 'write' }]
      };
      it('should return false', () => {
        expect(containsSpeakInteraction(state)).toEqual(false);
      });
    });
    describe('sequence does contain speak interaction', () => {
      const state = {
        trainers: [{ interaction: 'speak' }]
      };
      it('should return true', () => {
        expect(containsSpeakInteraction(state)).toEqual(true);
      });
    });
  });


  describe('#currentTrainerItemIndex', () => {
    describe('sequence has attempted items', () => {
      const customState = {
        currentTrainerIndex: 0,
        trainers: [
          {
            item_groups: [
              {
                items: [
                  {
                    id: 'correct-item',
                    learn_language_text: '((foo)) bar',
                    attempt: {}
                  },
                  {
                    id: 'unattempted-item',
                    learn_language_text: '((baz)) ((zwo))'
                  }
                ]
              }
            ]
          }
        ]
      };

      it('should return the index of the first not attempted item', () => {
        const received = currentTrainerItemIndex(customState);
        expect(received).toBe(1);
      });
    });

    describe('sequence has no items', () => {
      const customState = {
        currentTrainerIndex: 0,
        trainers: []
      };

      it('should return 0', () => {
        const received = currentTrainerItemIndex(customState);
        expect(received).toBe(0);
      });
    });
  });

  describe('#isFirstTrainerWithAutoplay', () => {
    describe('when trainer type is within the list of trainers with autoplay', () => {
      describe('when interaction in the list is not defined', () => {
        test('returns true', () => {
          const state = {
            trainers: [{
              type: 'trainer-with-autoplay',
              interaction: 'does-not-matter'
            }]
          };
          expect(isFirstTrainerWithAutoplay(state)).toEqual(true);
        });
      });

      describe('when trainer interaction match interaction in the list', () => {
        test('returns true', () => {
          const state = {
            trainers: [{
              type: 'trainer-interaction-with-autoplay',
              interaction: 'interaction-with-autoplay'
            }]
          };
          expect(isFirstTrainerWithAutoplay(state)).toEqual(true);
        });
      });

      describe('when trainer interaction does not match interaction in the list', () => {
        test('returns false', () => {
          const state = {
            trainers: [{
              type: 'trainer-interaction-with-autoplay',
              interaction: 'interaction-with-no-autoplay'
            }]
          };
          expect(isFirstTrainerWithAutoplay(state)).toEqual(false);
        });
      });
    });

    describe('when trainer type is not within the list of trainers with autoplay', () => {
      test('returns false', () => {
        const state = {
          trainers: [{ type: 'trainer-with-no-autoplay' }]
        };
        expect(isFirstTrainerWithAutoplay(state)).toEqual(false);
      });
    });
  });
});
