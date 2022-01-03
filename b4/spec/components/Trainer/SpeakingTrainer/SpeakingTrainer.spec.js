import React from 'react';
import { shallow } from 'enzyme';
import { SpeakingTrainer } from '../../../../src/components/Trainer/SpeakingTrainer/SpeakingTrainer';
import { replaceMatches } from '../../../../src/lib/matchingUtils/normalise';
jest.mock('../../../../src/lib/matchingUtils/normalise');
jest.mock('../../../../src/components/shared/FeedbackSheet/FeedbackSheet', () => 'FeedbackSheet');

describe('<SpeakingTrainer />', () => {
  afterEach(() => {
    replaceMatches.mockClear();
  });

  const audio = {
    playSound: jest.fn(),
    playSoundWithState: jest.fn(),
    preload: jest.fn(),
    reset: jest.fn(),
    stop: jest.fn()
  };

  const speech = {
    permissionsGranted: true,
    ended: false,
    error: '',
    listening: false,
    nomatch: false,
    recording: false,
    transcript: '',
    start: () => { },
    reset: () => { }
  };

  const defaultProps = {
    onContinue: () => { },
    onFeedbackAttemptCardClick: jest.fn(),
    onItemPlaybackCardClick: jest.fn(),
    onMicButtonClick: () => { },
    speech,
    mediaUrlService: {
      soundURL: jest.fn((url) => `mock-url-${url}.mp3`)
    },
    recordingService: {
      stop: jest.fn(),
      start: jest.fn(() => Promise.resolve())
    },
    item: {
      id: '123',
      sound: { id: '123' },
      learnLanguageText: 'learnLanguageText',
      displayLanguageText: 'displayLanguageText'
    },
    onRetry: jest.fn(),
    audio,
    translations: {
      micButton: {
        speak: 'Speak now',
        pressToSpeak: 'Press and start speaking'
      },
      trainerTitle: 'Listen, then say it out loud:',
      attemptFeedback: {
        labelYouSaid: 'We heard:',
        negativeFeedback: 'You’re getting there!',
        positiveFeedback: 'Sounds great!'
      }
    }
  };

  const defaultSoundPlayerProps = {
    triggerSound: jest.fn()
  };

  test('renders', () => {
    const wrapper = shallow(<SpeakingTrainer {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  describe('onFeedbackAttemptCardClick callback', () => {
    it('should be called on trigger users recorded sound', () => {
      const attempt = {
        text: 'die Stadt',
        mistakes: 0
      };
      const wrapper = shallow(<SpeakingTrainer
        {...defaultProps}
        attempt={attempt}
      />);
      const userSoundPlayer = shallow(wrapper.instance().renderUserSoundPlayer(defaultSoundPlayerProps));
      const simulateAttemptCardClick = userSoundPlayer.first().prop('onClick');
      simulateAttemptCardClick();
      expect(defaultProps.onFeedbackAttemptCardClick).toHaveBeenCalled();
    });
  });

  describe('onItemPlaybackCardClick callback', () => {
    it('should be called on trigger of item sound playback', () => {
      const attempt = {
        text: 'die Stadt',
        mistakes: 0
      };
      const wrapper = shallow(<SpeakingTrainer
        {...defaultProps}
        attempt={attempt}
      />);
      const userSoundPlayer = shallow(wrapper.instance().renderSoundPlayer(defaultSoundPlayerProps));
      const simulateAttemptCardClick = userSoundPlayer.first().prop('onClick');
      simulateAttemptCardClick();
      expect(defaultProps.onItemPlaybackCardClick).toHaveBeenCalled();
    });
  });

  describe('when audio is done', () => {
    const onSoundPlayEnded = jest.fn();
    let component;
    beforeEach(() => {
      onSoundPlayEnded.mockClear();
      component = shallow(<SpeakingTrainer
        {...defaultProps}
        onSoundPlayEnded={onSoundPlayEnded}
      />);

      component.instance().handleSoundPlayEnded();
    });

    test('should call onSoundPlayEnded', () => {
      expect(onSoundPlayEnded).toHaveBeenCalled();
    });

    test('should set isUserAllowedToSpeak in state', () => {
      component.instance().handleSoundPlayEnded();
      const isUserAllowedToSpeak = component.state('isUserAllowedToSpeak');
      expect(isUserAllowedToSpeak).toBeTruthy();
    });

    test('should not call onSoundPlayEnded twice', () => {
      component.instance().handleSoundPlayEnded();
      expect(onSoundPlayEnded).toHaveBeenCalledTimes(1);
    });
  });

  describe('feedback attempt text', () => {
    describe('when correct attempt', () => {
      test('learnLanguageText is shown', () => {
        const attempt = {
          text: 'die Stadt',
          mistakes: 0
        };
        const item = {
          id: '123',
          sound: { id: '123' },
          learnLanguageText: 'die kleine Stadt',
          displayLanguageText: 'small city'
        };
        const wrapper = shallow(<SpeakingTrainer
          {...defaultProps}
          attempt={attempt}
          item={item}
        />);
        const userSoundPlayer = shallow(wrapper.instance().renderUserSoundPlayer(defaultSoundPlayerProps));
        expect(userSoundPlayer.contains('die kleine Stadt')).toEqual(true);
      });
      test('FeedbackSheet has one button', () => {
        const attempt = {
          text: 'die Stadt',
          mistakes: 0
        };
        const wrapper = shallow(<SpeakingTrainer
          {...defaultProps}
          attempt={attempt}
        />);

        expect(wrapper.find('FeedbackSheet')).toMatchSnapshot();
      });
    });

    describe('when incorrect attempt', () => {
      test('transcript is shown', () => {
        replaceMatches.mockImplementationOnce(() => 'die grosse Strasse');

        const attempt = {
          text: 'die Stadt',
          mistakes: 1
        };
        const item = {
          id: '123',
          sound: { id: '123' },
          learnLanguageText: 'die kleine Stadt',
          displayLanguageText: 'small city'
        };
        const wrapper = shallow(<SpeakingTrainer
          {...defaultProps}
          attempt={attempt}
          item={item}
          speech={{ ...speech, transcript: 'die grosse Strasse' }}
        />);
        const userSoundPlayer = shallow(wrapper.instance().renderUserSoundPlayer(defaultSoundPlayerProps));
        expect(replaceMatches).toHaveBeenCalledWith('die grosse Strasse', undefined);
        expect(userSoundPlayer.contains('die grosse Strasse')).toEqual(true);
      });
      test('FeedbackSheet has two buttons', () => {
        const attempt = {
          text: 'die Stadt',
          mistakes: 1
        };
        const wrapper = shallow(<SpeakingTrainer
          {...defaultProps}
          attempt={attempt}
        />);

        expect(wrapper.find('FeedbackSheet')).toMatchSnapshot();
      });
    });
  });
});
