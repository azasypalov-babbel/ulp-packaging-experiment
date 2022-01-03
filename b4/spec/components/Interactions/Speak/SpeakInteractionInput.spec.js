import React from 'react';
import { shallow } from 'enzyme';
import { act } from 'react-dom/test-utils';
import {
  SpeakInteractionInput
} from '../../../../src/components/Interactions/Speak/SpeakInteractionInput/SpeakInteractionInput';
import useSpeech, { getSpeakableText } from '../../../../src/components/Interactions/Speak/useSpeech';
import { PERMISSIONS_STATUS } from '../../../../src/services/permissions/constants';
import useTrainerItemSounds from '../../../../src/components/Trainer/shared/useTrainerItemSounds';
import SpeechMicButton from '../../../../src/components/shared/MicButton/SpeechMicButton';
import SpeakItem from '../../../../src/components/Trainer/DialogTrainer/SpeakItem';
import { isWebview } from '../../../../src/lib/features';
import { STOP_REASON } from '../../../../src/services/speechRecognition/constants';
import mockSoundService from '../../../../src/services/soundService';

jest.mock('../../../../src/services/soundService');
jest.mock('../../../../src/components/Interactions/Speak/useSpeech');
jest.mock('../../../../src/components/Trainer/shared/useTrainerItemSounds');
jest.mock('../../../../src/lib/features');

const flushPromises = () => new Promise(setTimeout);
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
  onAttempt: jest.fn(),
  learnLanguageAlpha3: 'DEU',
  locale: 'en',
  onMicToggleClick: jest.fn(),
  soundService: mockSoundService
};
const mockPlayItemSound = jest.fn(() => new Promise(() => {}));
const mockUseSpeechActions = {
  start: jest.fn(() => new Promise(() => {})),
  stop: jest.fn()
};
const mockUseSpeechContext = {
  micPermission: PERMISSIONS_STATUS.granted,
  idle: false
};
const SPEECH_STATES = { RESTING: 'RESTING', ANY: 'ANY' };

describe('speak interaction input', () => {
  beforeEach(() => {
    getSpeakableText.mockImplementation((item) => item.learnLanguageText);
    useSpeech.mockImplementation(() => [
      SPEECH_STATES.RESTING,
      mockUseSpeechActions,
      mockUseSpeechContext
    ]);

    useTrainerItemSounds.mockImplementation(() => [
      mockPlayItemSound,
      () => false
    ]);
  });

  it('should render mic button', () => {
    const wrapper = shallow(<SpeakInteractionInput {...defaultProps} />);

    expect(wrapper.find(SpeechMicButton).exists()).toBeTruthy();

    expect(wrapper.find(SpeechMicButton).prop('appearance')).toBe('RESTING');
  });

  it('should render speak item', () => {
    getSpeakableText.mockImplementationOnce(() => 'Properly formatted text');
    const wrapper = shallow(<SpeakInteractionInput {...defaultProps} />);

    expect(wrapper.find(SpeakItem).exists()).toBeTruthy();

      // text should be parsed according to the getSpeakableText function
    expect(wrapper.find(SpeakItem).prop('text')).toBe('Properly formatted text');
  });

  it('should automatically start speech recognition', () => {
    shallow(<SpeakInteractionInput {...defaultProps} />);
    expect(mockUseSpeechActions.start).toHaveBeenCalledTimes(1);
    expect(mockUseSpeechActions.start).toHaveBeenCalledWith(defaultProps.item);
  });

  describe('clicking on the speak item', () => {
    it('should play item sound', () => {
      const wrapper = shallow(<SpeakInteractionInput {...defaultProps} />);
      act(() => {
        wrapper.find(SpeakItem).simulate('click');
      });
      expect(mockPlayItemSound).toHaveBeenCalledWith(defaultProps.item);
    });

    it('should start speech recognition after sound is done', async () => {
      mockPlayItemSound.mockImplementationOnce(() => {
        const ended = true;
        return Promise.resolve(ended);
      });
      const wrapper = shallow(<SpeakInteractionInput {...defaultProps} />);
      mockUseSpeechActions.start.mockClear();
      act(() => {
        wrapper.find(SpeakItem).simulate('click');
      });

      await flushPromises();

      expect(mockUseSpeechActions.start).toHaveBeenCalledWith(defaultProps.item);
    });
  });

  describe('tapping on the speak item should work like clicking on speak item', () => {
    const mockPreventDefault = jest.fn();
    it('should play item sound', () => {
      const wrapper = shallow(<SpeakInteractionInput {...defaultProps} />);
      mockUseSpeechActions.start.mockClear();
      act(() => {
        wrapper.find(SpeakItem).simulate('touchend', { preventDefault: mockPreventDefault });
      });

      expect(mockPlayItemSound).toHaveBeenCalledWith(defaultProps.item);
        // Should prevent onClick from being fired by touch events
      expect(mockPreventDefault).toHaveBeenCalled();
    });

    it('should start speech recognition after sound is done', async () => {
      mockPlayItemSound.mockImplementationOnce(() => Promise.resolve());
      const wrapper = shallow(<SpeakInteractionInput {...defaultProps} />);
      act(() => {
        wrapper.find(SpeakItem).simulate('touchend', { preventDefault: mockPreventDefault });
      });

      await flushPromises();

      expect(mockUseSpeechActions.start).toHaveBeenCalledWith(defaultProps.item);
    });
  });

  describe('when speech is interupted by audio playback', () => {
    it('should stop the speech recognition', () => {
      shallow(<SpeakInteractionInput {...defaultProps} />);

      act(() => {
        mockSoundService.subscribe.mock.calls.forEach(([listener]) => {
          listener(undefined, { event: 'play' });
        });
      });

      expect(mockUseSpeechActions.stop).toHaveBeenCalledWith(STOP_REASON.CANCEL);
    });
  });

  describe('tooltip state', () => {
    it('should show tooltip when in idle state', () => {
      useSpeech.mockImplementation(() => [
        SPEECH_STATES.ANY,
        mockUseSpeechActions,
        { ...mockUseSpeechContext, idle: true }
      ]);
      const wrapper = shallow(<SpeakInteractionInput {...defaultProps} />);
      const { showTooltip: showTooltip } = wrapper.find(SpeechMicButton).props();

      expect(showTooltip).toBe(true);
    });

    it('should not show tooltip when not in idle state', () => {
      useSpeech.mockImplementation(() => [
        SPEECH_STATES.ANY,
        mockUseSpeechActions,
        { ...mockUseSpeechContext, idle: false }
      ]);

      const wrapper = shallow(<SpeakInteractionInput {...defaultProps} />);
      const { showTooltip: showTooltipNext } = wrapper.find(SpeechMicButton).props();

      expect(showTooltipNext).toBe(false);
    });
  });

  describe('idle timer', () => {
    it('should disable idle timer while sounds are playing', () => {
      shallow(<SpeakInteractionInput {...defaultProps} />);

        // By default idle the timer is enabled.
      expect(useSpeech).toHaveBeenCalledWith(
        expect.anything(),
        { idleTimerEnabled: true }
      );

      useSpeech.mockClear();

      act(() => {
        mockSoundService.subscribe.mock.calls.forEach(([listener]) => {
          listener(undefined, { event: 'play' });
        });
      });

        // After any sound (globally) begins, the timer is disabled.
      expect(useSpeech).toHaveBeenCalledWith(
        expect.anything(),
        { idleTimerEnabled: false }
      );

      useSpeech.mockClear();

      act(() => {
        mockSoundService.subscribe.mock.calls.forEach(([listener]) => {
          listener(undefined, { event: 'end' });
        });
      });

        // After any sound (globally) ends, is paused or finishes, the timer is enabled again.
      expect(useSpeech).toHaveBeenCalledWith(
        expect.anything(),
        { idleTimerEnabled: true }
      );
    });
  });

  describe('in webview environment', () => {
    beforeEach(() => {
      isWebview.mockImplementation(() => true);
    });

    it('should not automatically start speech recognition', () => {
      shallow(<SpeakInteractionInput {...defaultProps} />);
      expect(mockUseSpeechActions.start).not.toHaveBeenCalled();
    });

    describe('tapping on the speak item', () => {
      const mockPreventDefault = jest.fn();
      it('should play item sound', () => {
        const wrapper = shallow(<SpeakInteractionInput {...defaultProps} />);
        mockUseSpeechActions.start.mockClear();
        act(() => {
          wrapper.find(SpeakItem).simulate('touchend', { preventDefault: mockPreventDefault });
        });

        expect(mockPlayItemSound).toHaveBeenCalledWith(defaultProps.item);
        // Should prevent onClick from being fired by touch events
        expect(mockPreventDefault).toHaveBeenCalled();
      });

      it('should not start speech recognition after sound is done', async () => {
        mockPlayItemSound.mockImplementationOnce(() => Promise.resolve());
        const wrapper = shallow(<SpeakInteractionInput {...defaultProps} />);
        act(() => {
          wrapper.find(SpeakItem).simulate('touchend', { preventDefault: mockPreventDefault });
        });

        await flushPromises();

        expect(mockUseSpeechActions.start).not.toHaveBeenCalledWith(defaultProps.item);
      });
    });

    describe('tooltip state', () => {
      it('should show tooltip when in idle state', () => {
        useSpeech.mockImplementation(() => [
          SPEECH_STATES.ANY,
          mockUseSpeechActions,
          { ...mockUseSpeechContext, idle: true }
        ]);
        const wrapper = shallow(<SpeakInteractionInput {...defaultProps} />);
        const { showTooltip: showTooltip } = wrapper.find(SpeechMicButton).props();

        expect(showTooltip).toBe(true);
      });

      it('should not show tooltip when not in idle state', () => {
        useSpeech.mockImplementation(() => [
          SPEECH_STATES.ANY,
          mockUseSpeechActions,
          { ...mockUseSpeechContext, idle: false }
        ]);

        const wrapper = shallow(<SpeakInteractionInput {...defaultProps} />);
        const { showTooltip: showTooltipNext } = wrapper.find(SpeechMicButton).props();

        expect(showTooltipNext).toBe(false);
      });
    });
  });
});
