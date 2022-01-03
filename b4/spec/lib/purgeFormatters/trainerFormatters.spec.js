import {
  removeCorrectItems,
  makeCorrectItemsNonInteractive,
  makeUnattemptedItemsNonInteractive
} from '../../../src/lib/purgeFormatters/trainerFormatters';

const trainer = {
  item_groups: [
    {
      items: [
        {
          id: '012',
          attempt: { mistakes: 0 }
        },
        {
          id: '022',
          attempt: { mistakes: 1 }
        },
        {
          id: '042'
        },
        {
          id: '052',
          attempt: { mistakes: 0 }
        },
        {
          id: '062',
          attempt: { skipped: true }
        }
      ]
    },
    {
      items: [
        {
          id: '012',
          attempt: { mistakes: 0 }
        },
        {
          id: '022',
          attempt: { mistakes: 2 }
        },
        {
          id: '072'
        }
      ]
    },
    {
      items: [
        {
          id: '012',
          attempt: { mistakes: 0 }
        }
      ]
    }
  ]
};

describe('trainerFormatters', () => {
  describe('#removeCorrectItems', () => {
    test('works', () => {
      expect(removeCorrectItems(trainer)).toMatchSnapshot();
    });
  });

  describe('#makeCorrectItemsNonInteractive', () => {
    test('works', () => {
      expect(makeCorrectItemsNonInteractive(trainer)).toMatchSnapshot();
    });
  });

  describe('#makeUnattemptedItemsNonInteractive', () => {
    test('works', () => {
      expect(makeUnattemptedItemsNonInteractive(trainer)).toMatchSnapshot();
    });
  });
});
