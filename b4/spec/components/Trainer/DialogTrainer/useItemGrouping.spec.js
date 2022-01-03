import {
  createSpeakerGrouping,
  getItems,
  isFirst
} from '../../../../src/components/Trainer/DialogTrainer/useItemGrouping';

const input = [
  { speakerRole: undefined, type: 'task' },
  {
    speakerRole: 'f2',
    type: 'phrase'
  },
  {
    speakerRole: 'm2',
    type: 'phrase'
  },
  {
    speakerRole: 'm2',
    type: 'phrase'
  },
  {
    speakerRole: 'm1',
    type: 'phrase'
  },
  {
    speakerRole: 'm1',
    type: 'phrase'
  },
  { speakerRole: undefined, type: 'task' },
  { speakerRole: undefined, type: 'task' },
  {
    speakerRole: 'm1',
    type: 'phrase'
  }
];

describe('grouping logic', ()=> {
  const groupsMap = createSpeakerGrouping(input);

  test('it makes groups based on the speakerRole property', () => {
    expect(groupsMap).toEqual(
      [
        [expect.objectContaining({ i: 0 })],
        [expect.objectContaining({ i: 1 })],
        [expect.objectContaining({ i: 2 }), expect.objectContaining({ i: 3 })],
        [expect.objectContaining({ i: 4 }), expect.objectContaining({ i: 5 })],
        [expect.objectContaining({ i: 6 }), expect.objectContaining({ i: 7 })],
        [expect.objectContaining({ i: 8 })]
      ]
    );
  });

  describe('isFirst', ()=> {
    test('returns true when an item is the first one of its group', () =>{
      expect(isFirst(groupsMap, input[0])).toEqual(true);
      expect(isFirst(groupsMap, input[1])).toEqual(true);
      expect(isFirst(groupsMap, input[2])).toEqual(true);
      expect(isFirst(groupsMap, input[4])).toEqual(true);
      expect(isFirst(groupsMap, input[6])).toEqual(true);
      expect(isFirst(groupsMap, input[8])).toEqual(true);
    });

    test('returns false when an item is not the first one of its group', () =>{
      expect(isFirst(groupsMap, input[3])).toEqual(false);
      expect(isFirst(groupsMap, input[5])).toEqual(false);
      expect(isFirst(groupsMap, input[7])).toEqual(false);
    });
  });

  describe('getItems', () => {
    test('should return a list of the items in the same group as an item', () => {
      expect(getItems(groupsMap, input[0])).toEqual([input[0]]);
      expect(getItems(groupsMap, input[1])).toEqual([input[1]]);
      expect(getItems(groupsMap, input[2])).toEqual([input[2], input[3]]);
      expect(getItems(groupsMap, input[3])).toEqual([input[2], input[3]]);
    });
  });
});
