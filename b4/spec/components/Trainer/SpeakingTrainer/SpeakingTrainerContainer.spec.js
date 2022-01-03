import React from 'react';
import {
  SpeakingTrainerContainer,
  mapStateToProps
} from '../../../../src/components/Trainer/SpeakingTrainer/SpeakingTrainerContainer';
import { shallow } from 'enzyme';
import {
  formatParentheses,
  getFirstCorrectSolution,
  removeGapFormatting,
  markupStringToPlainText,
  stripCurlyBracesAndContent
} from '@lessonnine/babbel-markup-helper.js';

jest.mock('../../../../src/lib/localStorage', () => ({
  getLocalStorage: () => ({
    set: jest.fn(),
    get: jest.fn()
  })
}));
jest.mock('../../../../src/components/Trainer/SpeakingTrainer/SpeakingTrainer');

import { formatDL } from '../../../../src/lib/markupFormatter';

jest.mock('../../../../src/lib/markupFormatter', () => ({
  formatDL: jest.fn((arg) => arg)
}));

jest.mock('@lessonnine/babbel-markup-helper.js', () => ({
  formatParentheses: jest.fn((s) => s),
  getFirstCorrectSolution: jest.fn((s) => s),
  removeGapFormatting: jest.fn((s) => s),
  markupStringToPlainText: jest.fn((s) => s),
  stripCurlyBracesAndContent: jest.fn((s) => s)
}));

import playFeedbackSound from '../../../../src/lib/playFeedbackSound';
jest.mock('../../../../src/lib/playFeedbackSound');

const mockAudio = {
  playSound: jest.fn((soundId, { onEnded }) => {
    if (onEnded) onEnded();
  }),
  playSoundWithState: jest.fn(),
  preload: jest.fn(),
  reset: jest.fn(),
  cleanup: jest.fn(),
  stop: jest.fn()
};

describe('<SpeakingTrainerContainer />', () => {
  const mockSpeechReset = jest.fn();

  const defaultProps = {
    locale: 'en_GB',
    learnLanguageAlpha3: 'RUS',
    learnLanguageBCP47: 'de-DE',
    displayLanguageBCP47: 'en-GB',
    mediaUrlService: {
      soundURL: jest.fn()
    },
    recordingService: {
      stop: jest.fn(),
      start: jest.fn(() => Promise.resolve())
    },
    speech: {
      permissionsGranted: true,
      ended: false,
      error: '',
      listening: false,
      start: jest.fn(),
      reset: mockSpeechReset,
      stop: jest.fn(),
      recording: false,
      transcript: 'test transcript'
    },
    micPermission: 'granted',
    completeItem: () => { },
    attemptItem: jest.fn(),
    onStart: jest.fn(),
    onFinish: jest.fn(),
    audio: mockAudio,
    trainer: {
      item_groups: [
        {
          items: [
            {
              id: 'a',
              sound: { id: 'aa' },
              learn_language_text: 'test a',
              display_language_text: 'TEST A'
            },
            {
              id: 'b',
              sound: { id: 'bb' },
              learn_language_text: 'test b',
              display_language_text: 'TEST B'
            },
            {
              id: 'c',
              sound: { id: 'cc' },
              learn_language_text: 'test c',
              display_language_text: 'TEST C'
            },
            {
              id: 'd',
              sound: { id: 'dd' },
              learn_language_text: 'test d (pl.)',
              display_language_text: 'TEST D'
            }
          ]
        }
      ]
    },
    track: jest.fn(),
    isMicOnboardingCompleted: false
  };

  describe('#mapStateToProps', () => {
    const state = {
      session: {
        learnLanguageAlpha3: 'RUS',
        locale: 'en_GB'
      },
      permissions: {
        micPermission: 'granted'
      },
      micOnboarding: {
        completed: true
      }
    };
    it('should match snapshot', () => {
      expect(mapStateToProps(state)).toEqual({
        micPermission: 'granted',
        learnLanguageBCP47: 'ru-RU',
        learnLanguageAlpha3: 'RUS',
        locale: 'en_GB'
      });
    });
  });

  describe('trainer item formatting', () => {
    let instance;

    beforeEach(() => {
      formatDL.mockClear();
      formatParentheses.mockClear();
      getFirstCorrectSolution.mockClear();
      removeGapFormatting.mockClear();
      markupStringToPlainText.mockClear();
      stripCurlyBracesAndContent.mockClear();

      const component = shallow(<SpeakingTrainerContainer {...defaultProps} />);
      instance = component.instance();
    });

    test('calls formatting methods', () => {
      expect(formatDL).toHaveBeenCalledTimes(instance.state.items.length);
      expect(formatParentheses).toHaveBeenCalledTimes(instance.state.items.length);
      expect(getFirstCorrectSolution).toHaveBeenCalledTimes(instance.state.items.length);
      expect(removeGapFormatting).toHaveBeenCalledTimes(instance.state.items.length);
      expect(markupStringToPlainText).toHaveBeenCalledTimes(instance.state.items.length);
      expect(stripCurlyBracesAndContent).toHaveBeenCalledTimes(instance.state.items.length);
    });

    test('strips parentheses and content', () => {
      expect(instance.state.items[3].learnLanguageText).toEqual('test d');
    });
  });

  describe('#handleAttempt', () => {
    it('should store attempt in state', () => {
      const component = shallow(<SpeakingTrainerContainer
        {...defaultProps}
      />);

      const attempt = {
        text: 'foo',
        solved: false,
        confidenceScore: 0.8501
      };

      component.instance().handleAttempt(attempt);
      expect(component.state('attempt')).toEqual({ mistakes: 2, text: 'foo' });

      component.instance().handleAttempt({ ...attempt, solved: true });
      expect(component.state('attempt')).toEqual({ mistakes: 0, text: 'foo' });
    });

    it('should play the feedback sound', () => {
      const component = shallow(<SpeakingTrainerContainer
        {...defaultProps}
      />);

      const attempt = {
        text: 'foo',
        solved: false,
        confidenceScore: 0.8501
      };

      component.instance().handleAttempt(attempt);
      expect(playFeedbackSound).toHaveBeenCalledTimes(1);
    });
  });

  describe('when speech recognition ends', () => {
    describe('when mic onboarding is completed', () => {
      it('should handle speech end', () => {
        const component = shallow(<SpeakingTrainerContainer
          {...defaultProps}
          isMicOnboardingCompleted={true}
        />);
        component.instance().setState({ micOnboardingComplete: true });
        const instance = component.instance();
        instance.handleSpeechEnd = jest.fn();

        component.setProps({ speech: { ...defaultProps.speech, ended: true } });
        expect(instance.handleSpeechEnd).toHaveBeenCalled();
      });
    });
  });

  describe('#handleSpeechEnd', () => {
    it('stops recordingService', () => {
      const component = shallow(<SpeakingTrainerContainer {...defaultProps} />);
      component.instance().handleSpeechEnd();
      expect(defaultProps.recordingService.stop).toHaveBeenCalled();
    });

    describe('speech ends with error or no transcript', () => {
      let instance;
      beforeEach(() => {
        const component = shallow(<SpeakingTrainerContainer
          {...defaultProps}
          speech={{
            ...defaultProps.speech,
            error: 'no-speech',
            transcript: ''
          }}
        />);
        instance = component.instance();
      });

      it('should not attempt item', () => {
        instance.handleSpeechEnd();
        expect(defaultProps.attemptItem).not.toHaveBeenCalled();
      });

      it('should not call handleAttempt method', () => {
        instance.handleAttempt = jest.fn();

        instance.handleSpeechEnd();
        expect(instance.handleAttempt).not.toHaveBeenCalled();
      });
    });

    describe('speech ends with transcript', () => {
      it('should attempt item', () => {
        const component = shallow(<SpeakingTrainerContainer
          {...defaultProps}
          speech={{
            ...defaultProps.speech,
            transcript: 'foo',
            solved: false,
            confidenceScore: 0.8501,
            engineName: 'WebAPISpeechRecognition'
          }}
        />);
        const item = {
          id: 'a',
          sound: { id: 'aa' },
          learnLanguageText: 'test a',
          displayLanguageText: 'TEST A'
        };
        const expectedAttempt = {
          text: 'foo',
          solved: false
        };

        component.instance().handleSpeechEnd();

        expect(defaultProps.attemptItem).toHaveBeenCalledWith(item, expectedAttempt);
      });

      it('should call handleAttempt method', () => {
        const component = shallow(<SpeakingTrainerContainer
          {...defaultProps}
          speech={{
            ...defaultProps.speech,
            transcript: 'testing 123',
            solved: true,
            confidenceScore: 0.8501,
            engineName: 'WebAPISpeechRecognition'
          }}
        />);

        const instance = component.instance();
        instance.handleAttempt = jest.fn(() => Promise.resolve());

        component.instance().handleSpeechEnd();
        expect(instance.handleAttempt).toHaveBeenCalledWith({ text: 'testing 123', solved: true });
      });
    });
  });

  describe('when speech error changes', () => {
    describe('when mic onboarding is completed', () => {
      let instance;

      beforeEach(() => {
        const component = shallow(<SpeakingTrainerContainer
          {...defaultProps}
          isMicOnboardingCompleted={true}
        />);

        instance = component.instance();
        instance.handleSpeechError = jest.fn();

        component.setProps({ speech: { ...defaultProps.speech, error: 'no-speech' } });
      });

      it('should handle speech error', () => {
        expect(instance.handleSpeechError).toHaveBeenCalled();
      });
    });
  });

  describe('#handleSpeechError', () => {
    it('attempts item with an error', () => {
      const component = shallow(<SpeakingTrainerContainer
        {...defaultProps}
        speech={{
          ...defaultProps.speech,
          engineName: 'WebAPISpeechRecognition',
          error: 'mock-error-language-not-supported'
        }}
      />);

      const item = {
        id: 'a',
        sound: { id: 'aa' },
        learnLanguageText: 'test a',
        displayLanguageText: 'TEST A'
      };
      const expectedAttempt = {
        engineName: 'WebAPISpeechRecognition',
        solved: false,
        error: 'mock-error-language-not-supported'
      };

      component.instance().handleSpeechError();
      expect(defaultProps.attemptItem).toHaveBeenCalledWith(item, expectedAttempt);
    });
  });

  describe('startSpeech', () => {
    let component;

    beforeEach(() => {
      defaultProps.speech.start.mockClear();
      defaultProps.audio.stop.mockClear();
    });

    describe('when not playing and not recording/listening', () => {
      beforeEach(() => {
        component = shallow(<SpeakingTrainerContainer {...defaultProps} />);
      });

      test('calls start speech', () => {
        component.instance().startSpeech();
        expect(defaultProps.speech.start).toHaveBeenCalled();
      });
    });

    describe('when audio is playing', () => {
      beforeEach(() => {
        component = shallow(<SpeakingTrainerContainer
          {...defaultProps}
          audio={{
            ...defaultProps.audio,
            isPlaying: true
          }}
        />);
      });

      test('should call audio stop', () => {
        component.instance().startSpeech();
        expect(defaultProps.audio.stop).toHaveBeenCalled();
      });
    });

    describe('when speech is listening or recording', () => {
      beforeEach(() => {
        component = shallow(<SpeakingTrainerContainer
          {...defaultProps}
          speech={{
            ...defaultProps.speech,
            recording: true,
            listening: false
          }}
        />);
      });

      test('should not start speech', () => {
        component.instance().startSpeech();
        expect(defaultProps.speech.start).not.toHaveBeenCalled();
      });
    });
  });

  describe('#handleAttemptRetry', () => {
    let component;
    let instance;

    beforeEach(() => {
      component = shallow(<SpeakingTrainerContainer {...defaultProps} />);
      instance = component.instance();
      instance.startSpeech = jest.fn();

      instance.handleAttemptRetry();
    });

    test('calls speech.reset', () => {
      expect(mockSpeechReset).toHaveBeenCalled();
    });

    test('calls startSpeech', () => {
      expect(instance.startSpeech).toHaveBeenCalled();
    });
  });

  describe('when onFeedbackAttemptCardClick callback is fired', () => {
    describe('when onboarding is not complete', () => {
      it('tracks gui:interacted', () => {
        const component = shallow(<SpeakingTrainerContainer {...defaultProps} />);
        component.instance().setState({ onboardingComplete: false, micOnboardingComplete: true });
        const onFeedbackAttemptCardClick = component.first().prop('onFeedbackAttemptCardClick');
        onFeedbackAttemptCardClick();
        expect(defaultProps.track).toHaveBeenCalledTimes(1);
        expect(defaultProps.track.mock.calls[0][0]).toMatchSnapshot();
      });
    });
  });

  describe('when onItemPlaybackCardClick callback is fired', () => {
    describe('when onboarding is not complete', () => {
      it('tracks gui:interacted', () => {
        const component = shallow(<SpeakingTrainerContainer {...defaultProps} />);
        component.instance().setState({ onboardingComplete: false, micOnboardingComplete: true });
        const onItemPlaybackCardClick = component.first().prop('onItemPlaybackCardClick');
        onItemPlaybackCardClick();
        expect(defaultProps.track).toHaveBeenCalledTimes(1);
        expect(defaultProps.track.mock.calls[0][0]).toMatchSnapshot();
      });
    });
  });

  describe('#handleMicButtonClick', () => {
    let component;
    let instance;

    beforeEach(() => {
      component = shallow(<SpeakingTrainerContainer {...defaultProps} />);
      instance = component.instance();
      instance.startSpeech = jest.fn();
    });

    afterEach(() => {
      defaultProps.track.mockClear();
    });

    describe('when onboarding is not complete', () => {
      beforeEach(() => {
        component.setProps({
          isMicOnboardingCompleted: false
        });
      });

      describe('when the first item is displayed', () => {
        beforeEach(() => {
          instance.setState({ currentIndex: 0 });
          instance.handleMicButtonClick();
        });

        it('starts speech', () => {
          expect(instance.startSpeech).toHaveBeenCalled();
        });

        it('tracks gui:interacted', () => {
          expect(defaultProps.track).toHaveBeenCalledTimes(1);
          expect(defaultProps.track.mock.calls[0][0]).toMatchSnapshot();
        });
      });

      describe('when not the first item is displayed', () => {
        beforeEach(() => {
          instance.setState({ currentIndex: 1 });
          instance.handleMicButtonClick();
        });

        it('starts speech', () => {
          expect(instance.startSpeech).toHaveBeenCalled();
        });

        it('does not send tracking event', () => {
          expect(defaultProps.track).not.toHaveBeenCalled();
        });
      });
    });

    describe('when onboarding is complete', () => {
      beforeEach(() => {
        instance.setState({ currentIndex: 0 });
        component.setProps({
          isMicOnboardingCompleted: true
        });

        instance.setState({ onboardingCompleted: true });
        instance.handleMicButtonClick();
      });

      it('starts speech', () => {
        expect(instance.startSpeech).toHaveBeenCalled();
      });

      it('does not send tracking event', () => {
        expect(defaultProps.track).not.toHaveBeenCalled();
      });
    });
  });
});
