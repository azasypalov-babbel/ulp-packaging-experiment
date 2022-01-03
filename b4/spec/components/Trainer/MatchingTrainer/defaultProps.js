import { ITEM_FRAGMENT_TYPE } from '../../../../src/components/Trainer/MatchingTrainer/constants';

export const MOCK_SOUND_ID = 'd3572193477785b1bc030cdf61ec777c'
export const MOCK_OPTION_ID = 'lasdfjlsajflkasjf';

const trainer = {
  type: 'matching',
  translationVisibility: 'partial',
  title: null,
  description: 'This is matching trainer - type 1',
  image: null,
  itemGroups: [
    {
      title: null,
      image: null,
      items: [
        {
          id: 'd85a01bdf3bac689e7bc4808365dc5e6',
          type: 'phrase',
          displayLanguageText: 'the fruit',
          learnLanguageText: 'das Obst',
          infoText: 'Obst gibt es in vielen verschiedenen Farben',
          image: null,
          sound: {
            id: MOCK_SOUND_ID
          },
          speakerRole: 'f1'
        },
        {
          id: '33df6f3aa74afbe4d6f541825f6e758d',
          type: 'phrase',
          displayLanguageText: 'the cheese',
          learnLanguageText: 'der Käse',
          infoText: 'Käse hat manchmal Löcher',
          image: null,
          sound: {
            id: MOCK_SOUND_ID
          },
          speakerRole: 'f1'
        },
        {
          id: 'b9cf73d37e1dd788faa5bf3cfaf3fd44',
          type: 'phrase',
          displayLanguageText: 'das Rhinozeros',
          learnLanguageText: 'the rhino',
          infoText: null,
          image: null,
          sound: {
            id: MOCK_SOUND_ID
          },
          speakerRole: 'f1'
        }
      ]
    }
  ],
  interaction: 'choose',
  dictate: false,
  puzzleHelper: false
};

export const matchingOptionDefaultProps = {
  appearance: 'ACTIVE',
  itemText: 'the cheese',
  onOptionClick: jest.fn(),
  position: ITEM_FRAGMENT_TYPE.OPTION,
  style: { order: -1 },
  trainerActive: true,
  showTranslation: true,
  isClickable: true,
  id: MOCK_OPTION_ID,
  isOption: true,
  soundId: MOCK_SOUND_ID,
};

export const matchingBaseDefaultProps = {
  appearance: 'ACTIVE',
  itemText: 'der Käse',
  onOptionClick: jest.fn(),
  position: ITEM_FRAGMENT_TYPE.BASE,
  style: { order: -1 },
  trainerActive: true,
  showTranslation: true,
  id: 'kasdfjlsajflkasjf',
  isOption: false,
  soundId: MOCK_SOUND_ID
};

export const trainerType2 = {
  type: 'matching type 2',
  translationVisibility: 'partial',
  title: null,
  description: 'This is matching trainer - type 2',
  image: null,
  itemGroups: [
    {
      title: 'null',
      image: null,
      items: [
        {
          id: 'd85a01bdf3bac689e7bc4808365dc5e6',
          type: 'phrase',
          displayLanguageText: 'I walk',
          learnLanguageText: 'ich_laufe',
          infoText: null,
          image: null,
          sound: {
            id: MOCK_SOUND_ID
          },
          speakerRole: 'f1'
        },
        {
          id: '33df6f3aa74afbe4d6f541825f6e758d',
          type: 'phrase',
          displayLanguageText: 'you walk',
          learnLanguageText: 'du_läufst',
          infoText: null,
          image: null,
          sound: {
            id: MOCK_SOUND_ID
          },
          speakerRole: 'f1'
        },
        {
          id: 'b9cf73d37e1dd788faa5bf3cfaf3fd44',
          type: 'phrase',
          displayLanguageText: 'he/she/it walks',
          learnLanguageText: 'er/sie/es_läuft',
          infoText: null,
          image: null,
          sound: {
            id: MOCK_SOUND_ID
          },
          speakerRole: 'f1'
        }
      ]
    }
  ],
  interaction: 'choose',
  dictate: false,
  puzzleHelper: false
};

// This is a simple example where some items
// can be solved by one of two options
export const trainerWithMultipleCorrectOptionsSimple = {
  ...trainer,
  itemGroups: [
    {
      title: 'null',
      image: null,
      items: [
        {
          id: 'ich-darf-id',
          type: 'phrase',
          displayLanguageText: 'I may',
          learnLanguageText: 'ich_darf',
          infoText: null,
          image: null,
          sound: {
            id: MOCK_SOUND_ID
          },
          speakerRole: 'm1'
        },
        {
          id: 'er-darf-id',
          type: 'phrase',
          displayLanguageText: "he may",
          learnLanguageText: 'er/sie/es_darf',
          infoText: null,
          image: null,
          sound: {
            id: '0bc89e18f42c9d7ae29e314c49188fdd'
          },
          speakerRole: 'm1'
        }
      ]
    }
  ]
};

// This is an example of real content where some items
// can be solved by one of two options
export const trainerWithMultipleCorrectOptionsReal = {
  ...trainer,
  itemGroups: [
    {
      title: 'null',
      image: null,
      items: [
        {
          id: 'fc5be2778bad400f8b8e426046fae335',
          type: 'phrase',
          displayLanguageText: 'we drive',
          learnLanguageText: 'wir_fahr**en**',
          infoText: null,
          image: null,
          sound: { id: MOCK_SOUND_ID },
          speakerRole: 'f2'
        },
        {
          id: '7f58beefc2de4dcda7e5c4bad49a22e4',
          type: 'phrase',
          displayLanguageText: 'you (pl.) drive',
          learnLanguageText: 'ihr_fahr**t**',
          infoText: null,
          image: null,
          sound: { id: MOCK_SOUND_ID },
          speakerRole: 'f2'
        },
        {
          id: '22b5dc01dfeb4b1d8dc1d8d983fef698',
          type: 'phrase',
          displayLanguageText: 'they/you (formal) drive',
          learnLanguageText: 'sie/Sie_fahr**en**',
          infoText: null,
          image: null,
          sound: { id: '9b1d96e3b52544f9984012548fe63fa2' },
          speakerRole: 'f2'
        }
      ]
    }
  ]
};

export default {
  attemptItem: jest.fn(),
  completeItem: jest.fn(),
  currentTrainerItemIndex: 0,
  learnLanguageAlpha3: 'ENG',
  onFinish: jest.fn(),
  onStart: jest.fn(),
  trainer,
  displayInfoText: jest.fn(),
};
