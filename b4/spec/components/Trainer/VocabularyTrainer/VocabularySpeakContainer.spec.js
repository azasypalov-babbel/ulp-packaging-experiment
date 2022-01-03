import React from 'react';
import { shallow } from 'enzyme';

import {
  formatParentheses,
  getFirstCorrectSolution,
  removeGapFormatting,
  markupStringToPlainText,
  stripCurlyBracesAndContent,
  markupStringToHTML
} from '@lessonnine/babbel-markup-helper.js';

jest.mock('@lessonnine/babbel-markup-helper.js', () => ({
  formatParentheses: jest.fn((s) => s),
  getFirstCorrectSolution: jest.fn((s) => s),
  removeGapFormatting: jest.fn((s) => s),
  markupStringToPlainText: jest.fn((s) => s),
  stripCurlyBracesAndContent: jest.fn((s) => s),
  markupStringToHTML: jest.fn((s) => s)
}));

import { stripParantheses } from '../../../../src/lib/markupFormatter';
jest.mock('../../../../src/lib/markupFormatter', () => ({
  stripParantheses: jest.fn((s) => s)
}));

import playFeedbackSound from '../../../../src/lib/playFeedbackSound';
jest.mock('../../../../src/lib/playFeedbackSound');

import {
  VocabularySpeakContainer
} from '../../../../src/components/Trainer/VocabularyTrainer/VocabularySpeakContainer';
jest.mock('../../../../src/components/Trainer/VocabularyTrainer/VocabularySpeak', () => 'VocabularySpeak');


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

describe('VocabularySpeakContainer', () => {
  const defaultProps = {
    trainer: {
      title: null,
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
              learn_language_text: 'test b  (pl.)',
              display_language_text: 'TEST B'
            }
          ]
        }
      ]
    },
    onStart: jest.fn(),
    onFinish: jest.fn(),
    displayInfoText: jest.fn(),
    clearInfoTextUI: jest.fn(),
    mediaUrlService: {
      soundURL: jest.fn((id) => `${id}.mp3`)
    },
    speech: {
      ended: false,
      error: '',
      listening: false,
      start: jest.fn(),
      reset: jest.fn(),
      stop: jest.fn(),
      recording: false,
      engineName: 'WebAPISpeechRecognition',
      transcript: 'test transcript',
      permissionsGranted: true
    },
    learnLanguageBCP47: 'de-DE',
    track: jest.fn(),
    locale: 'en_GB',
    learnLanguageAlpha3: 'DEU',
    shallUserPass: true,
    shouldShowToolbar: true,
    audio: mockAudio,
    skipItem: jest.fn(),
    attemptItem: jest.fn(),
    completeItem: jest.fn(),
    isMicEnabled: true,
    onItemAttempt: jest.fn()
  };

  it('renders VocabularySpeak component', () => {
    const wrapper = shallow(<VocabularySpeakContainer {...defaultProps} />);

    expect(wrapper.find('VocabularySpeak')).toHaveLength(1);
  });

  describe('title formatting', () => {
    beforeEach(() => {
      markupStringToHTML.mockClear();
    });

    test('is not called, if there is no title', () => {
      shallow(<VocabularySpeakContainer {...defaultProps} />);
      expect(markupStringToHTML).not.toHaveBeenCalled();
    });

    test('is called, if there is a title', () => {
      const commonProps = {
        ...defaultProps,
        trainer: {
          ...defaultProps.trainer,
          title: 'a title'
        }
      };
      shallow(<VocabularySpeakContainer {...commonProps} />);
      expect(markupStringToHTML).toHaveBeenCalled();
    });
  });

  it('calls onStart method when mounting', () => {
    const wrapper = shallow(<VocabularySpeakContainer {...defaultProps} />);

    expect(defaultProps.onStart).toHaveBeenCalledWith({
      scorableItemsCount: wrapper.instance().state.items.length
    });
  });

  describe('sound preloading', () => {
    beforeEach(() => {
      shallow(<VocabularySpeakContainer {...defaultProps} />);
    });

    it('should preload item sounds', () => {
      expect(mockAudio.preload).toHaveBeenCalledWith('aa.mp3');
      expect(mockAudio.preload).toHaveBeenCalledWith('bb.mp3');
    });
  });

  describe('#handleMicButtonInteraction', () => {
    let component;
    let instance;

    beforeEach(() => {
      component = shallow(<VocabularySpeakContainer {...defaultProps} />);
      instance = component.instance();
      instance.startSpeech = jest.fn();
    });

    it('starts speech', () => {
      instance.handleMicButtonInteraction();

      expect(instance.startSpeech).toHaveBeenCalled();
    });

    describe('when user should be tracked', () => {
      it('tracks gui:interacted event', () => {
        instance.handleMicButtonInteraction();

        expect(defaultProps.track).toHaveBeenCalledTimes(1);
        expect(defaultProps.track.mock.calls[0][0]).toMatchSnapshot();
      });
    });

    describe('when user should not be tracked', () => {
      it('does not tracks gui:interacted event', () => {
        const component = shallow(<VocabularySpeakContainer {...defaultProps} shallUserPass={false} />);
        instance = component.instance();
        instance.startSpeech = jest.fn();
        instance.handleMicButtonInteraction();

        expect(defaultProps.track).not.toHaveBeenCalled();
      });
    });
  });

  describe('when item sound finishes playing', () => {
    describe('when WebAPISpeechRecognition is used', () => {
      let component;
      let instance;
      beforeEach(() => {
        component = shallow(<VocabularySpeakContainer
          {...defaultProps}
          speech={{
            ...defaultProps.speech,
            engineName: 'WebAPISpeechRecognition'
          }}
        />);
        instance = component.instance();
        instance.startSpeech = jest.fn();

        instance.handleSoundPlayEnded();
      });

      it('starts speech automatically', () => {
        expect(instance.startSpeech).toHaveBeenCalled();
      });
    });

    describe('when BridgedSiriSpeechRecognition is used', () => {
      let component;
      let instance;
      beforeEach(() => {
        component = shallow(<VocabularySpeakContainer
          {...defaultProps}
          speech={{
            ...defaultProps.speech,
            engineName: 'BridgedSiriSpeechRecognition'
          }}
        />);
        instance = component.instance();
        instance.startSpeech = jest.fn();

        instance.handleSoundPlayEnded();
      });

      it('does not start speech automatically', () => {
        expect(instance.startSpeech).not.toHaveBeenCalled();
      });
    });
  });

  describe('#handleItemPlaybackCardClick', () => {
    let component;
    let instance;

    beforeEach(() => {
      component = shallow(<VocabularySpeakContainer {...defaultProps} />);
      instance = component.instance();
    });

    describe('when user should be tracked', () => {
      it('tracks gui:interacted event', () => {
        instance.handleItemPlaybackCardClick();

        expect(defaultProps.track).toHaveBeenCalledTimes(1);
        expect(defaultProps.track.mock.calls[0][0]).toMatchSnapshot();
      });
    });

    describe('when user should not be tracked', () => {
      it('does not tracks gui:interacted event', () => {
        const component = shallow(<VocabularySpeakContainer {...defaultProps} shallUserPass={false} />);
        instance = component.instance();
        instance.handleItemPlaybackCardClick();

        expect(defaultProps.track).not.toHaveBeenCalled();
      });
    });
  });

  describe('#handleAttempt', () => {
    it('should store attempt in state', () => {
      const component = shallow(<VocabularySpeakContainer
        {...defaultProps}
      />);

      const attempt = {
        text: 'foo',
        solved: false,
        confidenceScore: 0.8501
      };

      component.instance().handleAttempt(attempt);
      expect(component.state('attempt')).toEqual({ mistakes: 1, text: 'foo' });

      component.instance().handleAttempt({ ...attempt, solved: true });
      expect(component.state('attempt')).toEqual({ mistakes: 0, text: 'foo' });
    });

    it('should play the feedback sound', () => {
      const component = shallow(<VocabularySpeakContainer
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

  describe('#handleSpeechEnd', () => {
    describe('speech ends with error or no transcript', () => {
      let instance;
      beforeEach(() => {
        const component = shallow(<VocabularySpeakContainer
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
        const component = shallow(<VocabularySpeakContainer
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
          solved: false,
          number: 1
        };

        component.instance().handleSpeechEnd();

        expect(defaultProps.attemptItem).toHaveBeenCalledWith(item, expectedAttempt);
      });

      it('should call handleAttempt method', () => {
        const component = shallow(<VocabularySpeakContainer
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

  describe('when speech recognition ends', () => {
    it('should handle speech end', () => {
      const component = shallow(<VocabularySpeakContainer
        {...defaultProps}
      />);
      const instance = component.instance();
      instance.handleSpeechEnd = jest.fn();

      component.setProps({ speech: { ...defaultProps.speech, ended: true } });
      expect(instance.handleSpeechEnd).toHaveBeenCalled();
    });
  });

  describe('startSpeech', () => {
    let component;

    beforeEach(() => {
      defaultProps.speech.start.mockClear();
      defaultProps.audio.stop.mockClear();
      stripParantheses.mockClear();
      formatParentheses.mockClear();
      getFirstCorrectSolution.mockClear();
      removeGapFormatting.mockClear();
      markupStringToPlainText.mockClear();
      stripCurlyBracesAndContent.mockClear();
    });

    describe('when not playing and not recording/listening', () => {
      beforeEach(() => {
        component = shallow(<VocabularySpeakContainer {...defaultProps} />);
      });

      test('calls start speech', () => {
        component.instance().startSpeech();
        expect(defaultProps.speech.start).toHaveBeenCalled();
      });

      describe('target text is formatted', () => {
        test('calls formatting methods', () => {
          component.instance().startSpeech();
          expect(stripParantheses).toHaveBeenCalled();
          expect(formatParentheses).toHaveBeenCalled();
          expect(getFirstCorrectSolution).toHaveBeenCalled();
          expect(removeGapFormatting).toHaveBeenCalled();
          expect(markupStringToPlainText).toHaveBeenCalled();
          expect(stripCurlyBracesAndContent).toHaveBeenCalled();
        });
      });
    });

    describe('when audio is playing', () => {
      beforeEach(() => {
        component = shallow(<VocabularySpeakContainer
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
        component = shallow(<VocabularySpeakContainer
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

  describe('#handleSpeechError', () => {
    it('attempts item with an error', () => {
      const component = shallow(<VocabularySpeakContainer
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

  describe('when speech error changes', () => {
    describe('when mic onboarding is completed', () => {
      let instance;

      beforeEach(() => {
        const component = shallow(<VocabularySpeakContainer
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

  describe('when retrying a failed item', () => {
    describe('when WebAPISpeechRecognition is used', () => {
      let component;
      let instance;

      beforeEach(() => {
        component = shallow(<VocabularySpeakContainer
          {...defaultProps}
          speech={{
            ...defaultProps.speech,
            engineName: 'WebAPISpeechRecognition'
          }}
        />);
        instance = component.instance();
        instance.startSpeech = jest.fn();

        instance.handleAttemptRetry();
      });

      test('calls speech.reset', () => {
        expect(defaultProps.speech.reset).toHaveBeenCalled();
      });

      test('restarts speech automatically', () => {
        expect(instance.startSpeech).toHaveBeenCalled();
      });
    });

    describe('when BridgedSiriSpeechRecognition is used', () => {
      let component;
      let instance;

      beforeEach(() => {
        component = shallow(<VocabularySpeakContainer
          {...defaultProps}
          speech={{
            ...defaultProps.speech,
            engineName: 'BridgedSiriSpeechRecognition'
          }}
        />);
        instance = component.instance();
        instance.startSpeech = jest.fn();

        instance.handleAttemptRetry();
      });

      test('calls speech.reset', () => {
        expect(defaultProps.speech.reset).toHaveBeenCalled();
      });

      test('does not restart speech automatically', () => {
        expect(instance.startSpeech).not.toHaveBeenCalled();
      });
    });
  });

  describe('#handleContinueClick', () => {
    let component;
    let instance;
    const attempt = { mistakes: 2, text: 'foo' };
    const currentIndex = 0;

    beforeEach(() => {
      component = shallow(<VocabularySpeakContainer {...defaultProps} />);
      instance = component.instance();
      component.setState({
        currentIndex,
        attempt
      });

      instance.handleContinueClick();
    });

    test('calls completeItem with attempt', () => {
      const item = instance.state.items[currentIndex];
      expect(defaultProps.completeItem).toHaveBeenCalledWith(item, attempt.mistakes);
    });

    test('calls speech.reset', () => {
      expect(defaultProps.speech.reset).toHaveBeenCalled();
    });

    test('calls audio.stop', () => {
      expect(defaultProps.audio.stop).toHaveBeenCalled();
    });

    test('resets the attempt', () => {
      expect(instance.state.attempt).toEqual(undefined);
    });

    describe('when is not the last item', () => {
      test('update currentIndex', () => {
        expect(instance.state.currentIndex).toEqual(currentIndex + 1);
      });
    });

    describe('when is the last item', () => {
      let component;
      let instance;

      beforeEach(() => {
        component = shallow(<VocabularySpeakContainer {...defaultProps} />);
        instance = component.instance();
        component.setState({
          currentIndex: 2,
          attempt
        });

        instance.handleContinueClick();
      });

      test('calls onFinish', () => {
        expect(defaultProps.onFinish).toHaveBeenCalled();
      });
    });
  });

  describe('currentTrainerItemIndex', () => {
    let component;

    beforeEach(() => {
      component = shallow(<VocabularySpeakContainer {...defaultProps} currentTrainerItemIndex={1} />);
    });

    test('currentIndex should be set accordingly currentTrainerItemIndex', () => {
      expect(component.state('currentIndex')).toBe(1);
    });
  });
});
