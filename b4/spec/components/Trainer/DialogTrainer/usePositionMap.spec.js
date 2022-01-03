import {
  constructPositionMap
} from '../../../../src/components/Trainer/DialogTrainer/usePositionMap';

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

describe('constructPositionMap', ()=> {
  test('it makes a position map based on the speakerRole property', ()=> {
    expect(constructPositionMap(input)).toEqual({
      f2: 'left',
      m2: 'right',
      m1: 'left'
    });
  });
});
