import { trainersTypeInteractionMap } from '../../src/lib/trainersTypeInteractionMap';

const testMap = new Map([
  [
    { type: 'cube', interaction: 'speak' },
    { type: 'vocabulary', interaction: 'speak' }
  ],
  [
    { type: 'cube', interaction: 'choose' },
    { type: 'vocabulary', interaction: 'choose' }
  ],
  [
    { type: 'cube', interaction: 'write' },
    { type: 'vocabulary', interaction: 'write' }
  ],
  [
    { type: 'dictate', interaction: 'sort' },
    { type: 'dictate', interaction: 'wordorder' }
  ],
  [
    { type: 'memory', interaction: 'choose' },
    { type: 'vocabulary', interaction: 'click' }
  ],
  [
    { type: 'wordorder', interaction: 'choose' },
    { type: 'vocabulary', interaction: 'wordorder' }
  ]
]);

describe('trainersTypeInteractionMap', () => {
  test('should includes only specific trainers', () => {
    expect(trainersTypeInteractionMap).toMatchObject(testMap);
  });
});
