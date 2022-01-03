import { withoutHooks } from 'jest-react-hooks-shallow';
import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import useFeedbackSounds from '../../../../src/components/Interactions/shared/useFeedbackSounds';
import { ServiceContext } from '../../../../src/components/shared/withServices';

import incorrectFeedbackSound from '../../../../assets/sounds/babbel_wrong.mp3';
import correctFeedbackSound from '../../../../assets/sounds/babbel_correct.mp3';
import mockSoundService from '../../../../src/services/soundService';
jest.mock('../../../../src/services/soundService');

const Consumer = () => null;

const TestFeedback = () => {
  const [playFeedback, isFeedbackSoundDone] = useFeedbackSounds();
  return <Consumer
    playFeedback={playFeedback}
    isFeedbackSoundDone={isFeedbackSoundDone}
  />;
};

const mockServiceContext = {
  soundService: mockSoundService,
  settingsService: {
    isFeedbackSoundEnabled: true
  }
};

const getWrapper = () => {
  return mount(
    <TestFeedback />,
    {
      wrappingComponent: ServiceContext.Provider,
      wrappingComponentProps: { value: mockServiceContext }
    }
  );
};

describe('feedback sounds', () => {
  describe('when enabled', () => {
    describe('correct attempt', () => {
      it('should play correct feedback sound', () => {
        const wrapper = getWrapper();
        const { playFeedback } = wrapper.find(Consumer).props();
        act(() => {
          playFeedback(true);
        });
        const instance = mockServiceContext.soundService.getInstance(correctFeedbackSound);

        expect(instance.play).toHaveBeenCalledWith();
      });
    });

    describe('incorrect attempt', () => {
      it('should play incorrect feedback sound', () => {
        const wrapper = getWrapper();
        const { playFeedback } = wrapper.find(Consumer).props();
        act(() => {
          playFeedback(false);
        });

        const instance = mockServiceContext.soundService.getInstance(incorrectFeedbackSound);

        expect(instance.play).toHaveBeenCalledWith();
      });
    });
  });

  describe('when disabled', () => {
    beforeEach(() => {
      mockServiceContext.settingsService.isFeedbackSoundEnabled = false;
    });
    afterAll(() => {
      mockServiceContext.settingsService.isFeedbackSoundEnabled = true;
    });
    describe('correct attempt', () => {
      it('should not play any feedback sound', () => {
        const wrapper = getWrapper();
        const { playFeedback } = wrapper.find(Consumer).props();
        const correctSound = mockServiceContext.soundService.getInstance(correctFeedbackSound);

        act(() => {
          playFeedback();
        });

        expect(correctSound.play).not.toHaveBeenCalled();
      });
    });

    describe('incorrect attempt', () => {
      it('should not play any feedback sound', () => {
        const wrapper = getWrapper();
        const { playFeedback } = wrapper.find(Consumer).props();
        const incorrectSound = mockServiceContext.soundService.getInstance(incorrectFeedbackSound);
        act(() => {
          playFeedback(false);
        });

        expect(incorrectSound.play).not.toHaveBeenCalled();
      });
    });
  });

  describe('when a sound is already playing', () => {
    it('should not play any feedback sound', () => {
      const wrapper = getWrapper();
      const { playFeedback } = wrapper.find(Consumer).props();
      const incorrectSound = mockServiceContext.soundService.getInstance(incorrectFeedbackSound);
      const correctSound = mockServiceContext.soundService.getInstance(correctFeedbackSound);

      mockServiceContext
        .soundService
        .getPlayingInstances
        .mockReturnValueOnce([jest.fn(), jest.fn()]);

      act(() => {
        playFeedback(true);
      });

      expect(correctSound.play).not.toHaveBeenCalled();
      expect(incorrectSound.play).not.toHaveBeenCalled();
    });
  });

  describe('sound preloading', () => {
    it('should preload both feedback sounds immediately', () => {
      getWrapper();
      expect(mockServiceContext.soundService.preload).toHaveBeenCalledWith(incorrectFeedbackSound);
      expect(mockServiceContext.soundService.preload).toHaveBeenCalledWith(correctFeedbackSound);
    });
  });

  describe('feedback sound completed flag', () => {
    const events = [
      ...['playinitiated', 'play'].map((event) => [event, false]),
      ...['end', 'pause', 'playerror'].map((event) => [event, true])
    ];
    it.each(events)('after %s event completeness flag is marked %s', (event, flag) => {
      withoutHooks(() => {
        const wrapper = getWrapper();
        const prevProps = wrapper.find(Consumer).props();
        expect(prevProps.isFeedbackSoundDone).toBe(false);
        act(() => {
          prevProps.playFeedback(true);
          const instance = mockServiceContext.soundService.getInstance(correctFeedbackSound);
          instance.simulate(event);
        });
        wrapper.update();
        const { isFeedbackSoundDone } = wrapper.find(Consumer).props();
        expect(isFeedbackSoundDone).toBe(flag);
      });
    });
  });
});

