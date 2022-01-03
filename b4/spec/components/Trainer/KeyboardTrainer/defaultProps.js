export const items = [
  { // typical first item from first item group: the letter itself. no translation, sound recommended
    id: 'a',
    type: 'phrase',
    sound: { id: 'aa' },
    learnLanguageText: '((ш))',
    displayLanguageText: null
  },
  { // an example item, typically in the second item group. sound recommended, info text possible, translation possible
    id: 'b',
    type: 'phrase',
    learnLanguageText: 'хоро((ш))о',
    displayLanguageText: 'good'
  },
  { // example item with info text and sound
    id: 'c',
    type: 'phrase',
    sound: { id: 'bb7236b2093009f6657ed955ecd90a2a' },
    displayLanguageText: 'brother - to take',
    learnLanguageText: '**т** - **ть**: брат - брат((ь))',
    /* eslint-disable max-len */
    infoText: 'Did you hear the difference between the т in each word? The т in бра**ть** (with the soft sign) sounds softer.'
    /* eslint-enable max-len */
  },
  { // example item w/ sound but w/o info text
    id: 'd',
    type: 'phrase',
    sound: { id: '2160626a6358c7b0ad1579a8b2728929' },
    learnLanguageText: '**л** - **ль**: полка - пол((ь))ка',
    displayLanguageText: 'shelf - Polish (fem.)'
  },
  { // empty phrase item w/ sound
    id: 'e',
    type: 'phrase',
    sound: { id: 'bb' },
    learnLanguageText: null,
    displayLanguageText: null
  }
];

export const defaultPropsKeyboardContainer = {
  trainer: {
    title: null,
    interaction: 'fillin',
    translationVisibility: 'full',
    itemGroups: [
      {
        items: [items[0]]
      },
      {
        items: items.slice(1, items.length)
      }
    ]
  },
  onStart: jest.fn(),
  onFinish: jest.fn(),
  mediaUrlService: {
    soundURL: (id) => id
  },
  soundService: {
    play: jest.fn()
  },
  learnLanguageAlpha3: 'RUS',
  currentTrainerItemIndex: 0,
  attemptItem: jest.fn(),
  completeItem: jest.fn(),
  displayInfoText: jest.fn()
};

export const defaultPropsKeyboard = {
  translations: {
    title: 'This is the title'
  },
  title: null,
  description: 'For the English letter combination \'sh\' Russian uses a single letter: **ш**.',
  image: { id: '0' },
  visibleItems: items,
  interaction: 'fillin',
  onAttempt: jest.fn(),
  onItemComplete: jest.fn(),
  onToggleTranslationVisibility: jest.fn(),
  playItemSound: jest.fn(() => Promise.resolve()),
  active: true,
  currentItem: items[0],
  currentItemIndex: 0,
  getIndexInGroup: () => 0, // is this grouping also a feature of the keyboard trainer?
  targetCharacter: ' ш',
  translationVisible: false,
  translationVisibility: 'partial',
  learnLanguageAlpha3: 'RUS'
};
