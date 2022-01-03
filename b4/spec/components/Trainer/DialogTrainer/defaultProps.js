

export const items = [
  { // item 0 - interactive phrase w/ info text and sound
    id: 'a',
    type: 'phrase',
    sound: { id: 'aa' },
    infoText: 'Testing 123',
    displayLanguageText:
      // eslint-disable-next-line max-len
      'I also signed up and I\'m going on my first date "already today"! **(the solution is: \'mich\' or \'totally\')**',
    learnLanguageText:
      'Ich habe ((*mich|*totally)) auch angemeldet und gehe "noch heute" zu meinem ersten Treffen!',
    speakerRole: 'm1'
  },
  { // item 1 - task w/ info text
    id: 'b',
    type: 'task',
    infoText: 'Useful Info',
    displayLanguageText: 'Seine Freundin Aerdane ist erstaunt!',
    speakerRole: null
  },
  { // item 2 - noninteractive phrase w/ info text from another speaker
    id: 'c',
    type: 'phrase',
    infoText: 'More Useful Info',
    learnLanguageText: 'Argentina "became" **world champion**!',
    displayLanguageText: 'Argentina "salio" **campeon**',
    sound: { id: 'cc' },
    speakerRole: 'f1'
  },
  { // item 3 - noninteractive task w/o info text
    id: 'd',
    type: 'task',
    displayLanguageText: '"Y sho era" el **mejor**',
    speakerRole: null
  },
  { // item 4 - noninteractive phrase w/ sound but w/o info text
    id: 'e',
    type: 'phrase',
    sound: { id: 'ee' },
    learnLanguageText: 'But "I" actually don\'t **like** football',
    displayLanguageText: 'Pero en realidad no "me" **gusta** el fútbol',
    speakerRole: 'f1'
  },
  { // item 5 - interactive phrase w/ sound but w/o info text
    id: 'f',
    type: 'phrase',
    sound: { id: 'ff' },
    learnLanguageText: '"Eine" ((Woche)) besteht aus ((sieben Tagen)), **oder?**',
    displayLanguageText: '"One" week consists of seven days, **or not?**',
    speakerRole: 'm1'
  },
  { // item 6 - empty phrase item w/ sound
    id: 'h',
    type: 'phrase',
    sound: { id: 'bb' },
    learnLanguageText: null,
    displayLanguageText: null,
    speakerRole: 'f1'
  },
  { // item 7 - empty task row
    id: 'i',
    type: 'task',
    learnLanguageText: null,
    displayLanguageText: null,
    infoText: null,
    image: null,
    sound: null,
    speakerRole: null
  }
];

export const defaultPropsDialogContainer = {
  trainer: {
    title: null,
    interaction: 'write',
    translationVisibility: 'full',
    itemGroups: [{ items }]
  },
  mediaUrlService: {
    soundURL: jest.fn()
  },
  soundService: {
    play: jest.fn((url, options) => options?.onEnded && options.onEnded()),
    stop: jest.fn()
  },
  description: 'This is the trainer description',
  onStart: jest.fn(),
  onFinish: jest.fn(),
  track: jest.fn(),
  learnLanguageAlpha3: 'DEU',
  currentTrainerItemIndex: 0,
  attemptItem: jest.fn(),
  completeItem: jest.fn(),
  clearInfoTextUI: jest.fn(),
  displayInfoText: jest.fn()
};

export const defaultPropsDialog = {
  translations: {
    trainerTitle: {
      fillin: 'Dialog Fillin Title',
      puzzlehelper: 'Dialog Puzzlehelper Title',
      choose: 'Dialog Choicebutton Title'
    }
  },
  title: null,
  image: { id: '0' },
  visibleItems: items,
  interaction: 'fillin',
  onAttempt: jest.fn(),
  onItemComplete: jest.fn(),
  onToggleTranslationVisibility: jest.fn(),
  playItemSound: jest.fn(),
  active: true,
  currentItem: items[0],
  translationVisible: true,
  translationVisibility: 'full',
  learnLanguageAlpha3: 'DEU',
  isItemSoundPlaying: jest.fn(() => false)
};

