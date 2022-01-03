import formatters from '../../../src/lib/purgeFormatters/trainerItemFormatters';

describe('formatters', function() {
  describe('#removeCorrectItems', function() {
    test('removes items without mistakes', function() {
      const items = [
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
        },
        {
          id: '072'
        }
      ];

      const expectedItems = [
        {
          id: '022',
          attempt: { mistakes: 1 }
        },
        {
          id: '042'
        },
        {
          id: '062',
          attempt: { skipped: true }
        },
        {
          id: '072'
        }
      ];

      expect(formatters.removeCorrectItems(items)).toEqual(expectedItems);
    });
  });

  describe('#makeCorrectItemsNonInteractive', function() {
    test('adds nonInteractive flag to correct items', function() {
      const items = [
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
        },
        {
          id: '072'
        }
      ];

      const expectedItems = [
        {
          id: '012',
          attempt: { mistakes: 0 },
          nonInteractive: true
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
          attempt: { mistakes: 0 },
          nonInteractive: true
        },
        {
          id: '062',
          attempt: { skipped: true }
        },
        {
          id: '072'
        }
      ];

      expect(formatters.makeCorrectItemsNonInteractive(items)).toEqual(expectedItems);
    });
  });

  describe('#makeUnattemptedItemsNonInteractive', () => {
    test('adds nonInteractive flag to items unattempted', () => {
      const items = [
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
        },
        {
          id: '072',
          attempt: { skipped: true }
        }
      ];

      const expectedItems = [
        {
          id: '012',
          attempt: { mistakes: 0 }
        },
        {
          id: '022',
          attempt: { mistakes: 1 }
        },
        {
          id: '042',
          nonInteractive: true
        },
        {
          id: '052',
          attempt: { mistakes: 0 }
        },
        {
          id: '062',
          attempt: { skipped: true }
        },
        {
          id: '072',
          attempt: { skipped: true }
        }
      ];
      expect(formatters.makeUnattemptedItemsNonInteractive(items)).toEqual(expectedItems);
    });
  });
});
