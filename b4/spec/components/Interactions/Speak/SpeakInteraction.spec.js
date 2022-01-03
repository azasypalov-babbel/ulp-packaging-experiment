import React from 'react';
import { shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { SpeakInteraction } from '../../../../src/components/Interactions/Speak/SpeakInteraction';

import useFeedbackSounds from '../../../../src/components/Interactions/shared/useFeedbackSounds';
import SpeakInteractionInput from
  '../../../../src/components/Interactions/Speak/SpeakInteractionInput/SpeakInteractionInput';
import { types } from '../../../../src/services/speechRecognition/engines';
import { RESULTS } from '../../../../src/lib/matchingUtils/evaluate';
import SpeakInteractionFeedback from '../../../../src/components/Interactions/Speak/SpeakInteractionFeedback';
import mockSpeechRecognitionService from '../../../../src/services/speechRecognition/service';

jest.mock('../../../../src/components/Interactions/shared/useFeedbackSounds', () => jest.fn());

const mockPlayFeedback = jest.fn();

const defaultProps = {
  item: {
    id: '54b0d60a168b9e9bdb979d5086e3c53f',
    type: 'phrase',
    displayLanguageText: null,
    learnLanguageText: '**Kani:** ((Hi, du bist Nicole, oder?))',
    infoText: null,
    image: null,
    sound: {
      id: 'd3572193477785b1bc030cdf61ec777c'
    },
    speakerRole: 'f1'
  },
  learnLanguageAlpha3: 'DEU',
  setMicSettings: jest.fn(),
  active: false,
  onFinish: jest.fn(),
  onAttempt: jest.fn(),
  isMicEnabled: false,
  speechRecognitionService: mockSpeechRecognitionService
};

describe('SpeakInteraction', () => {
  beforeEach(() => {
    useFeedbackSounds.mockImplementation(() => [
      mockPlayFeedback,
      false
    ]);
    mockSpeechRecognitionService.getEngineName.mockImplementation(() => 'NONE');
  });

  test('should render correctly', () => {
    const component = shallow(<SpeakInteraction {...defaultProps} />);
    expect(component).toMatchSnapshot();
  });

  describe('when entering the lesson without speaking', () => {
    const noSpeakProps = {
      ...defaultProps,
      active: true,
      isMicEnabled: false
    };

    it('should render loading ellipsis', () => {
      const wrapper = shallow(<SpeakInteraction {...noSpeakProps} />);
      expect(wrapper.text()).toEqual('...');
    });

    it('should not render interaction or feedback', () => {
      const wrapper = shallow(<SpeakInteraction {...noSpeakProps} />);
      expect(wrapper.find(SpeakInteractionInput).exists()).toBeFalsy();
      expect(wrapper.find(SpeakInteractionFeedback).exists()).toBeFalsy();
    });

    it('should automatically finish interaction immediately', () => {
      shallow(<SpeakInteraction {...noSpeakProps} />);
      expect(noSpeakProps.onFinish).toHaveBeenCalled();
    });
  });

  describe('when speech recognition is not supported', () => {
    const speakNotSupportedProps = {
      ...defaultProps,
      active: true,
      isMicEnabled: true // User selects enter the lesson with microphone
                         // (this should not really be possible but this isolates the test case)
    };

    beforeEach(() => {
      // Users device does not support speech recognition
      defaultProps.speechRecognitionService.getEngineName
        .mockImplementation(() => 'NONE');
    });

    it('should render loading ellipsis', () => {
      const wrapper = shallow(<SpeakInteraction {...speakNotSupportedProps} />);
      expect(wrapper.text()).toEqual('...');
    });

    it('should no render interaction or feedback', () => {
      const wrapper = shallow(<SpeakInteraction {...speakNotSupportedProps} />);
      expect(wrapper.find(SpeakInteractionInput).exists()).toBeFalsy();
      expect(wrapper.find(SpeakInteractionFeedback).exists()).toBeFalsy();
    });

    it('should automatically finish interaction immediately', () => {
      shallow(<SpeakInteraction {...speakNotSupportedProps} />);
      expect(speakNotSupportedProps.onFinish).toHaveBeenCalled();
    });
  });

  describe('speak mode', () => {
    const speakProps = {
      ...defaultProps,
      active: true,
      isMicEnabled: true // User selects enter the lesson with microphone
    };
    beforeEach(() => {
      // Users device supports speech recognition
      defaultProps.speechRecognitionService.getEngineName
        .mockImplementation(() => types.WEB_SPEECH);
    });

    it('should render loading ellipsis', () => {
      const wrapper = shallow(<SpeakInteraction {...speakProps} />);
      expect(wrapper.text()).toEqual('...');
    });

    it('should not automatically finish interaction immediately', () => {
      shallow(<SpeakInteraction {...speakProps} />);
      expect(speakProps.onFinish).not.toHaveBeenCalled();
    });

    it('should render in UI for input state', () => {
      const wrapper = shallow(<SpeakInteraction {...speakProps} />);
      let input = wrapper.find(SpeakInteractionInput);
      expect(input.exists()).toBeTruthy();
    });

    describe('when an attempt is made', () => {
      const mockAttempt = {
        inputText: 'Hi bist du eine Cowboy oder',
        text: 'Hi, du bist Nicole, oder?',
        solved: false,
        feedbackType: 'INCORRECT'
      };
      it('should transition to feedback state', () => {
        const wrapper = shallow(<SpeakInteraction {...speakProps} />);
        let { onAttempt } = wrapper.find(SpeakInteractionInput).props();

        act(() => {
          onAttempt(mockAttempt);
        });

        expect(wrapper.find(SpeakInteractionFeedback).exists()).toBeTruthy();
      });
      it('should report the attempt to the application', () => {
        const wrapper = shallow(<SpeakInteraction {...speakProps} />);
        let { onAttempt } = wrapper.find(SpeakInteractionInput).props();

        act(() => {
          onAttempt(mockAttempt);
        });

        expect(defaultProps.onAttempt).toHaveBeenCalledWith({
          attempt: {
            number: 1,
            inputText: 'Hi bist du eine Cowboy oder',
            text: 'Hi, du bist Nicole, oder?',
            solved: false
          }
        });

        act(() => {
          onAttempt(mockAttempt);
        });

        // Should increment number with each attempt
        expect(defaultProps.onAttempt).toHaveBeenCalledWith({
          attempt: {
            number: 2,
            inputText: 'Hi bist du eine Cowboy oder',
            text: 'Hi, du bist Nicole, oder?',
            solved: false
          }
        });
      });

      describe('feedback sounds', () => {
        describe('with no mistakes', () => {
          it('should play corrrect sound', () => {
            const wrapper = shallow(<SpeakInteraction {...speakProps} />);
            let { onAttempt } = wrapper.find(SpeakInteractionInput).props();

            act(() => {
              onAttempt({
                ...mockAttempt,
                solved: true,
                feedbackType: RESULTS.CORRECT
              });
            });

            expect(mockPlayFeedback).toHaveBeenCalledTimes(1);
            expect(mockPlayFeedback).toHaveBeenCalledWith(true);
          });
        });
        describe('when a mistake is made', () => {
          it('should play sound for incorrect attempt', () => {
            const wrapper = shallow(<SpeakInteraction {...speakProps} />);
            let { onAttempt } = wrapper.find(SpeakInteractionInput).props();

            act(() => {
              onAttempt({
                ...mockAttempt,
                solved: false,
                feedbackType: RESULTS.INCORRECT
              });
            });

            expect(mockPlayFeedback).toHaveBeenCalledTimes(1);
            expect(mockPlayFeedback).toHaveBeenCalledWith(false);
          });
        });
      });
    });

    describe('feedback state', () => {
      const mockAttempt = {
        inputText: 'Hi bist du eine Cowboy oder',
        text: 'Hi, du bist Nicole, oder?',
        solved: false,
        feedbackType: 'INCORRECT'
      };

      let wrapper;

      beforeEach(() => {
        wrapper = shallow(<SpeakInteraction {...speakProps} />);
        let { onAttempt } = wrapper.find(SpeakInteractionInput).props();
        act(() => {
          onAttempt(mockAttempt);
        });
      });

      it('should provide the latest attempt to be used in the feedback', () => {
        let { latestAttempt } = wrapper.find(SpeakInteractionFeedback).props();
        expect(latestAttempt).toEqual(mockAttempt);
      });

      it('should provide the item to be used in the feedback', () => {
        let { item } = wrapper.find(SpeakInteractionFeedback).props();
        expect(item).toEqual(speakProps.item);
      });

      it('should return to input state on retry', () => {
        let { onRetry } = wrapper.find(SpeakInteractionFeedback).props();
        act(() => {
          onRetry();
        });

        expect(wrapper.find(SpeakInteractionInput).exists()).toBeTruthy();
        expect(wrapper.find(SpeakInteractionFeedback).exists()).toBeFalsy();
      });

      it('should finish the interaction when the user proceeds', () => {
        let { onProceed } = wrapper.find(SpeakInteractionFeedback).props();
        act(() => {
          onProceed();
        });
        expect(speakProps.onFinish).toHaveBeenCalledWith(1);
      });

      describe('when another attempt is made', () => {
        beforeEach(() => {
          let { onRetry } = wrapper.find(SpeakInteractionFeedback).props();
          act(() => {
            onRetry();
          });

          let { onAttempt } = wrapper.find(SpeakInteractionInput).props();
          act(() => {
            onAttempt(mockAttempt);
          });
        });

        it('should report the overall number of mistakes on finish', () => {
          let { onProceed } = wrapper.find(SpeakInteractionFeedback).props();
          act(() => {
            onProceed();
          });
          expect(speakProps.onFinish).toHaveBeenCalledWith(2);
        });
      });
    });
  });
});
