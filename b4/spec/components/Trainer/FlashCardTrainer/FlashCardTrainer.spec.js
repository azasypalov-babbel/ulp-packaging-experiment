import React from 'react';
import { FlashCardTrainer }  from '../../../../src/components/Trainer/FlashCardTrainer/FlashCardTrainer';
import FlashCard from '../../../../src/components/Trainer/FlashCardTrainer/Flashcard/FlashCard';
import { shallow } from 'enzyme';

import { isWebview } from '../../../../src/lib/features';
import IconButton from '../../../../src/components/shared/IconButton/IconButton';
jest.mock('../../../../src/lib/features');


const imageURL = jest.fn().mockImplementation(() => 'http://image.jpg');
const onContinueMock = jest.fn();

const mockAudio = {
  playSound: jest.fn(),
  playSoundWithState: jest.fn(),
  preload: jest.fn(),
  reset: jest.fn(),
  stop: jest.fn()
};

describe('<FlashCardTrainer />', () => {
  const defaultProps = {
    item: {
      id: '549f9ecf012e7f3b636ec9e4ac5a0d10',
      learnLanguageText: 'One',
      displayLanguageText: 'Two',
      sound: {
        id: 'd3572193477785b1bc030cdf61ec777c'
      },
      image: {
        id: 'd3572193477785b1bc030cdf61ec777c'
      }
    },
    locale: 'en',
    learnLanguageAlpha3: 'DEU',
    onContinue: onContinueMock,
    mediaUrlService: {
      imageURL,
      soundURL: jest.fn((val) => `http://localhost/${val}.mp3`)
    },
    translations: {
      title: 'title',
      buttonUnknown: 'button-unknown',
      buttonKnown: 'button-known'
    },
    onToggleShortcuts: jest.fn(),
    audio: mockAudio
  };

  const mockSoundPlayerProps = { triggerSound: jest.fn(), isPlaying: false };

  beforeEach(() => {
    mockSoundPlayerProps.triggerSound.mockClear();
  });

  test('renders', () => {
    const component = shallow(
      <FlashCardTrainer {...defaultProps} />
    );

    const flashcardComponent = shallow(component
      .instance()
      .renderFlashCard(mockSoundPlayerProps)
    );
    expect(component).toMatchSnapshot();
    expect(flashcardComponent).toMatchSnapshot();
  });

  describe('Shortcut button', () => {
    describe('when in Webview', () => {
      beforeEach(() => {
        isWebview.mockImplementation(() => true);
      });

      test('should not render the shortcut button', () => {
        const component = shallow(<FlashCardTrainer {...defaultProps} />);
        const buttons = component.find(IconButton);

        expect(buttons).toHaveLength(0);
      });
    });

    describe('when NOT in Webview', () => {
      beforeEach(() => {
        isWebview.mockImplementation(() => false);
      });

      test('should render the shortcut button', () => {
        const component = shallow(<FlashCardTrainer {...defaultProps} />);
        const buttons = component.find(IconButton);

        expect(buttons).toHaveLength(1);
      });
    });
  });

  describe('with missing sound asset', () => {
    it('should render', () => {
      const renderComponent = () => {
        const component = shallow(
          <FlashCardTrainer
            {...defaultProps}
            item={{
              ...defaultProps.item,
              sound: null
            }}
          />
        );

        shallow(component
          .instance()
          .renderFlashCard()
        );
      };

      expect(renderComponent).not.toThrow();
    });
  });

  describe('with missing image asset', () => {
    it('should render', () => {
      const renderComponent = () => {
        const component = shallow(
          <FlashCardTrainer
            {...defaultProps}
            item={{
              ...defaultProps.item,
              image: null
            }}
          />
        );
        shallow(component
          .instance()
          .renderFlashCard(mockSoundPlayerProps)
        );
      };
      expect(renderComponent).not.toThrow();
    });
  });

  describe('when FlashCard is clicked', () => {
    let component;
    let getFlashCardWrapper;

    beforeEach(() => {
      component = shallow(<FlashCardTrainer {...defaultProps} />);
      getFlashCardWrapper = () => shallow(component
        .instance()
        .renderFlashCard(mockSoundPlayerProps)
      );
    });

    it('should show PlayButton', () => {
      let flashCardWrapper = getFlashCardWrapper();
      let flashCard = flashCardWrapper.find(FlashCard);
      expect(flashCard.props().imageChildren).toEqual(false);

      component.instance().handleFlashCardClick(mockSoundPlayerProps);

      flashCardWrapper = getFlashCardWrapper();
      flashCard = flashCardWrapper.find(FlashCard);
      expect(flashCard.props().imageChildren).toBeTruthy();
    });

    it('should reveal hidden text', () => {
      let flashCardWrapper = getFlashCardWrapper();
      let textReveal = flashCardWrapper.find('TextReveal');
      expect(textReveal.props().reveal).toBe(false);

      component.instance().handleFlashCardClick(mockSoundPlayerProps);

      flashCardWrapper = getFlashCardWrapper();
      textReveal = flashCardWrapper.find('TextReveal');
      expect(textReveal.props().reveal).toBe(true);
    });

    it('should play sound', () => {
      component.instance().handleFlashCardClick(mockSoundPlayerProps);

      expect(mockSoundPlayerProps.triggerSound).toHaveBeenCalledTimes(1);
    });
  });

  describe('onContinue callback', () => {
    let instance;

    beforeEach(() => {
      const component = shallow(<FlashCardTrainer {...defaultProps} />);

      instance = component.instance();
      instance.handleFlashCardClick(mockSoundPlayerProps);
    });

    describe('when "unknown"', () => {
      it('should call onContinue', () => {
        instance.handleContinueClick(false);
        expect(onContinueMock).toHaveBeenCalledWith(defaultProps.item, { mistakes: 2 });
      });
    });

    describe('when "known"', () => {
      it('should call OnContinue', () => {
        instance.handleContinueClick(true);
        expect(onContinueMock).toHaveBeenCalledWith(defaultProps.item, { mistakes: 0 });
      });
    });
  });
});
