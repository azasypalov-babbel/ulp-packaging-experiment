export const trainersTypeInteractionMap = new Map([
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
