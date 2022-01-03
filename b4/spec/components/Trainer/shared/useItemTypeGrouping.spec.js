import {
  createGroupMapping,
  getIndexInGroup,
  getLastIndexInGroup
} from '../../../../src/components/Trainer/shared/useItemTypeGrouping';

const testItems = [
  // Group one last index 1
  { type: 'task' },
  { type: 'phrase' },

  // Group two last index 7
  { type: 'task' },
  { type: 'task' },
  { type: 'phrase' },
  { type: 'phrase' },
  { type: 'phrase' },
  { type: 'phrase' },

  // Group three last index 9
  { type: 'task' },
  { type: 'phrase' },

  // Group four last index 11
  { type: 'task' },
  { type: 'phrase' },

  // Group five last index 14
  { type: 'task' },
  { type: 'phrase' },
  { type: 'phrase' },

  // Last group
  { type: 'task' }
];

describe('grouping logic', () => {
  describe('group map', () => {
    it('should chunk indexes into groups', () => {
      expect(createGroupMapping(testItems))
        .toEqual([
          [0, 1],
          [2, 3, 4, 5, 6, 7],
          [8, 9],
          [10, 11],
          [12, 13, 14],
          [15]
        ]);
    });
  });
  describe('finding the last index of the current group', () => {
    it('should be 7 given the current item is index 5', () => {
      expect(getLastIndexInGroup(
        testItems[5],
        testItems,
        createGroupMapping(testItems)
      )).toBe(7);
    });

    it('should be 14 given the current item is index 12', () => {
      expect(getLastIndexInGroup(
        testItems[12],
        testItems,
        createGroupMapping(testItems)
      )).toBe(14);
    });

    it('should be 15 given the last item', () => {
      expect(getLastIndexInGroup(
        testItems[testItems.length - 1],
        testItems,
        createGroupMapping(testItems)
      )).toBe(15);
    });
  });
  describe('index in group', () => {
    it('should return 1 given index 13', () => {
      expect(getIndexInGroup(
        testItems[13],
        testItems,
        createGroupMapping(testItems)
      )).toBe(1);
    });
  });
});

