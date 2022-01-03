import React from 'react';
import { act } from 'react-dom/test-utils';
import { mountWithTheme } from '../../shared/themeMock';

import { VocabularyTrainer } from '../../../../src/components/Trainer/VocabularyTrainer/VocabularyTrainer';
import { TRAINER_STATE } from '../../../../src/components/Trainer/VocabularyTrainer/constants';
import { withServicesProvider } from '../../../../src/components/shared/withServices';
import mockSoundService from '../../../../src/services/soundService';

jest.mock('../../../../src/services/soundService');
jest.mock('../../../../src/lib/matchingUtils/normalise');

const MockInteraction = () => null;

describe('<VocabularyTrainer />', () => {
  const item = {
    id: '123',
    sound: { id: '123' },
    image: { id: '123' },
    learnLanguageText: 'Frage "nach" einer Person mit ((wer)). ((Wer)) **bist du**?',
    displayLanguageText: 'Ask "for" a person with who. Who **are you**?',
    infoText: 'This is a "formatted" info **text**'
  };

  const defaultProps = {
    dictate: false,
    translations: {
      trainerTitle: {
        dictatefillin: 'Vocabulary DictateFillin Title',
        dictatepuzzlehelper: 'Vocabulary DictatePuzzlehelper Title',
        dictatewordorder: 'Vocabulary DictateWordorder Title',
        fillin: 'Vocabulary Fillin Title',
        puzzlehelper: 'Vocabulary Puzzlehelper Title',
        wordorder: 'Vocabulary Wordorder Title'
      }
    },
    title: null,
    item,
    interaction: <MockInteraction />,
    interactionType: 'fillin',
    onToggleTranslationVisibility: jest.fn(),
    onSoundPlayComplete: () => {},
    trainerState: TRAINER_STATE.READY,
    currentIndex: 0,
    translationVisible: true,
    translationVisibility: 'full'
  };
  const services = {
    mediaUrlService: {
      soundURL: jest.fn((url) => `mock-url-${url}.mp3`),
      imageURL: jest.fn((url) => `mock-url-${url}.jpg`)
    },
    soundService: mockSoundService
  };
  const Component = withServicesProvider(() => services)(VocabularyTrainer);

  const getWrapper = (props = {}) => mountWithTheme(
    <Component {...defaultProps} {...props} />
  );
  describe('renders', () => {
    describe('images', () => {
      it('with soundless items', async () => {
        const soudlessItem = { sound: null, ...item };
        const wrapper = getWrapper({ item: soudlessItem });
        expect(wrapper.find('img[src="mock-url-123.jpg"]').exists()).toBe(true);
        expect(wrapper.find('PlayButton').exists()).toBe(false);
      });
    });

    describe('sound player', () => {
      it('with default props', async () => {
        const wrapper = getWrapper({ dictate: true });
        expect(wrapper.find('PlayButton').exists()).toBe(true);
        expect(wrapper.find('img[src="mock-url-123.jpg"]').exists()).toBe(false);
      });

      it('with soundless items', async () => {
        const soudlessItem = { sound: null, ...item };
        const wrapper = getWrapper({ dictate: true, item: soudlessItem });
        expect(wrapper.find('PlayButton').exists()).toBe(true);
      });
    });

    it('with full props', async ()=> {
      const wrapper = getWrapper();
      expect(wrapper).toMatchSnapshot();
    });

    it('with an interaction', async () => {
      const wrapper = getWrapper();
      expect(wrapper.exists(MockInteraction)).toBe(true);
    });
  });

  describe('interaction', () => {
    describe('automatically playing the sound', () => {
      it('dictate plays sound on mount', () => {
        getWrapper({ dictate: true });
        const soundInstanceMock = services.soundService.getInstance('mock-url-123.mp3');
        expect(soundInstanceMock.play).toBeCalledTimes(1);
      });

      it('vocab plays sound on mount', () => {
        const wrapper = getWrapper({ dictate: false });
        const soundInstanceMock = services.soundService.getInstance('mock-url-123.mp3');
        expect(soundInstanceMock.play).toBeCalledTimes(0);
        wrapper.setProps({ trainerState: TRAINER_STATE.AWAITING_CONTINUE });
        wrapper.update();
      });
    });

    describe('manually playing sound', () => {
      it('play the sound when play button pressed', async () =>{
        const soundInstanceMock = services.soundService.getInstance('mock-url-123.mp3');
        const wrapper = getWrapper({ dictate: true });
          // end autoplay first
        await act(async () => {
          soundInstanceMock.simulate('end');
        });
        wrapper.update();
        expect(wrapper.find('PlayButton').prop('isPlaying')).toBe(false);
        await act(async () => {
          soundInstanceMock.simulate('play');
          wrapper.find('PlayButton').invoke('onClick');
        });
        wrapper.update();
        expect(wrapper.find('PlayButton').prop('isPlaying')).toBe(true);
      });
    });
  });

  describe('title', () => {
    describe('when prop title is defined', () => {
      it('should render title from props', async () => {
        const titleText = 'test title';
        const wrapper = getWrapper({ title: titleText });
        expect(wrapper.find('[data-selector="title"]').find('h1').text())
          .toEqual(titleText);
      });
    });

    describe('when prop title is not defined', () => {
      it('should render title from translations based on the trainer interaction', async () => {
        const wrapper = getWrapper();
        expect(wrapper.find('[data-selector="title"]').find('h1').text())
          .toEqual(defaultProps.translations.trainerTitle[defaultProps.interactionType]);
      });

      it('should render title from dictate translations based on the trainer interaction', async () => {
        const wrapper = getWrapper({ dictate: true });
        expect(wrapper.find('[data-selector="title"]').find('h1').text())
          .toEqual(defaultProps.translations.trainerTitle[`dictate${defaultProps.interactionType}`]);
      });
    });
  });

  describe('title formatting', () => {
    it('is called, if there is a title', async () => {
      const title = 'formatt{ed}';
      const wrapper = getWrapper({ title });
      expect(wrapper.find('[data-selector="title"]').find('h1').text()).toEqual('formatt(ed)');
    });

    it('can handle html / babbel markup formatting', async () => {
      const title = 'a "really" nicely **formatted** title';
      const textTitle = 'a really nicely formatted title';
      const formattedTitle = 'a <i>really</i> nicely <b>formatted</b> title';
      const wrapper = getWrapper({ title });
      expect(wrapper.find('[data-selector="title"]').find('h1').text()).toEqual(textTitle);
      expect(wrapper.find('[data-selector="title"]').find('h1').html()).toContain(formattedTitle);
    });
  });

  describe('Translations', () => {
    describe('with "full" translation visibility', () => {
      it('should display translation text', async () => {
        expect(
          getWrapper().find('[data-selector="item-translation"]').first().text()
        ).toEqual('Ask for a person with who. Who are you?');
      });

      it('should not display a toggle button', async () => {
        expect(getWrapper().exists('[data-selector="translation-toggle"]')).toBe(false);
      });

      it('should support html format for translation text', async () => {
        expect(
          getWrapper().find('[data-selector="item-translation"]').first().html()
        ).toContain('Ask <i>for</i> a person with who. Who <b>are you</b>?');
      });
    });

    describe('with "none" translation visibility', () => {
      const visibilityProps = {
        translationVisibility: 'none',
        translationVisible: false
      };
      it('should not display translation text', () => {
        expect(getWrapper(visibilityProps).exists('[data-selector="item-translation"]')).toBe(false);
      });

      it('should not display a toggle button', () => {
        expect(getWrapper(visibilityProps).exists('[data-selector="translation-toggle"]')).toBe(false);
      });
    });

    describe('with "partial" translation visibility', () => {
      const visibilityProps = {
        translationVisibility: 'partial',
        translationVisible: false
      };
      it('should not display translation text', async () => {
        expect(getWrapper(visibilityProps).exists('[data-selector="item-translation"]')).toBe(false);
      });

      it('should display a toggle button', async () => {
        expect(getWrapper(visibilityProps).exists('[data-selector="translation-toggle"]')).toBe(true);
      });

      it('should execute toggle function when clicking on the toggle button', async () => {
        getWrapper(visibilityProps).find('[data-selector="translation-toggle"]').at(4).simulate('click');
        expect(defaultProps.onToggleTranslationVisibility).toHaveBeenCalled();
      });
    });
  });

  describe('review item with no image or sound', () => {
    const item = {
      id: '3920bdb267b8a8044e013c845ba23973',
      displayLanguageText: 'Das ist die Gelegenheit, uns kennenzulernen!',
      learnLanguageText: '((*C\'est l\'occasion|*C\'est le moment|*C\'est l\'opportunité)) de nous rencontrer !',
      info_text: '',
      type: 'phrase',
      image: null,
      sound: null
    };

    it('shound render without an image', async () => {
      const wrapper = getWrapper({ item });
      expect(wrapper.exists('img')).toBe(false);
    });
  });
});
