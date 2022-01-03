import React from 'react';
import { shallow } from 'enzyme';

import { VocabularySpeak } from '../../../../src/components/Trainer/VocabularyTrainer/VocabularySpeak';
import { replaceMatches } from '../../../../src/lib/matchingUtils/normalise';

jest.mock('../../../../src/lib/matchingUtils/normalise');
jest.mock('../../../../src/components/shared/FeedbackSheet/FeedbackSheet', () => 'FeedbackSheet');

describe('<VocabularySpeak />', () => {
  const audio = {
    playSound: jest.fn(),
    playSoundWithState: jest.fn(),
    preload: jest.fn(),
    reset: jest.fn(),
    stop: jest.fn(),
    isEnded: false
  };

  const speech = {
    ended: false,
    error: '',
    listening: false,
    nomatch: false,
    recording: false,
    transcript: '',
    start: () => { },
    reset: () => { },
    stop: () => { }
  };

  const defaultProps = {
    shouldShowToolbar: true,
    onRetry: jest.fn(),
    onContinue: jest.fn(),
    onSkip: jest.fn(),
    translations: {
      micButton: {
        speak: 'Speak now',
        pressToSpeak: 'Press and start speaking',
        tapToSpeak: 'Tap, hold and speak'
      },
      trainerTitle: 'Listen, then say it out loud:',
      attemptFeedback: {
        negativeFeedback: 'You’re getting there!',
        positiveFeedback: 'Sounds great!',
        labelYouSaid: 'You said:'
      }
    },
    title: null,
    item: {
      id: '123',
      sound: { id: '123' },
      image: { id: '123' },
      learnLanguageText: 'learnLanguageText',
      displayLanguageText: 'displayLanguageText'
    },
    mediaUrlService: {
      soundURL: jest.fn((url) => `mock-url-${url}.mp3`),
      imageURL: jest.fn((url) => `mock-url-${url}.jpg`)
    },
    audio,
    userAudio: audio,
    userAudioUrl: 'http://audio-url/audio.mp3',
    onSoundPlayEnded: jest.fn(),
    onMicButtonClick: jest.fn(),
    isSpeakMode: true,
    speech,
    recordingService: {
      stop: jest.fn(),
      start: jest.fn(() => Promise.resolve())
    },
    onFeedbackAttemptCardClick: jest.fn(),
    onItemPlaybackCardClick: jest.fn()
  };

  beforeEach(() => {
    defaultProps.onFeedbackAttemptCardClick.mockClear();
    replaceMatches.mockClear();
  });

  test('renders', () => {
    const wrapper = shallow(<VocabularySpeak {...defaultProps} />, { disableLifecycleMethods: true });
    expect(wrapper).toMatchSnapshot();
  });

  describe('title', () => {
    describe('when prop title is defined', () => {
      test('should render title from props', () => {
        const titleText = 'test title';
        const wrapper = shallow(
          <VocabularySpeak {...defaultProps} title={titleText} />,
          { disableLifecycleMethods: true }
        );

        expect(wrapper.find('[data-selector="title"]').props().dangerouslySetInnerHTML)
          .toEqual({ __html: titleText });
      });
    });

    describe('when prop title is not defined', () => {
      test('should render title from translations', () => {
        const wrapper = shallow(<VocabularySpeak {...defaultProps} />, { disableLifecycleMethods: true });
        expect(wrapper.find('[data-selector="title"]').childAt(0).text())
          .toEqual(defaultProps.translations.trainerTitle);
      });
    });
  });

  describe('onItemPlaybackCardClick callback', () => {
    const defaultSoundPlayerProps = {
      triggerSound: jest.fn()
    };

    it('should be called on trigger of item sound playback', () => {
      const attempt = {
        text: 'die Stadt',
        mistakes: 0
      };
      const wrapper = shallow(<VocabularySpeak
        {...defaultProps}
        attempt={attempt}
      />, { disableLifecycleMethods: true });
      const userSoundPlayer = shallow(wrapper.instance().renderSoundPlayer(defaultSoundPlayerProps));
      const simulateAttemptCardClick = userSoundPlayer.first().prop('onClick');
      simulateAttemptCardClick();
      expect(defaultProps.onItemPlaybackCardClick).toHaveBeenCalled();
    });
  });

  describe('FeedbackSheet', () => {
    let component;

    beforeEach(() => {
      component = shallow(<VocabularySpeak {...defaultProps} />, { disableLifecycleMethods: true });
    });

    describe('when there is no attempt', () => {
      beforeEach(() => {
        component.setProps({ attempt: undefined });
      });

      it('does not render feedback sheet', () => {
        expect(component.find('FeedbackSheet')).toHaveLength(0);
      });
    });

    describe('when there is attempt', () => {
      beforeEach(() => {
        component.setProps({ attempt: { text: 'Two', mistakes: 1 } });
      });

      it('renders feedback sheet', () => {
        expect(component.find('FeedbackSheet')).toHaveLength(1);
      });
    });
  });

  describe('scroll to the mic button', () => {
    const component = shallow(
      <VocabularySpeak {...defaultProps} audio={{ ...audio, isEnded: true }} />, { disableLifecycleMethods: true }
    );
    const mockRef = { scrollIntoView: jest.fn() };
    component.instance().micButtonRef.current = mockRef;

    beforeEach(() => {
      mockRef.scrollIntoView.mockClear();
    });

    it('after sound has played`', () => {
      component.instance().componentDidUpdate({
        attempt: null,
        speech: true,
        audio: { isEnded: false }
      });
      expect(mockRef.scrollIntoView).toHaveBeenCalled();
    });
  });
});
