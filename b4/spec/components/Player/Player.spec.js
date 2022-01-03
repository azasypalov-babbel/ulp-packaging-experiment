import { mount } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { ThemeProvider } from 'styled-components';

import Player from '../../../src/components/Player/Player';
import { ServiceContext } from '../../../src/components/shared/withServices';
import mockSoundService from '../../../src/services/soundService';
import { theme } from '../../../src/providers/theme';
import ToolTip from '../../../src/components/shared/ToolTip';

jest.mock('../../../src/components/shared/hooks/useMounted', () => ({
  useMounted: () => () => true,
  __esModule: true
}));
jest.mock('../../../src/services/soundService');
jest.mock('@lessonnine/design-system.lib');

const audioUrls = [
  'audio1.mp3',
  'audio2.mp3',
  'audio3.mp3',
  'audio4.mp3'
];

const defaultProps = { audioUrls };

const getWrapper = (props) => mount(
  <ThemeProvider theme={theme}><Player {...defaultProps} {...props} /></ThemeProvider>,
  {
    wrappingComponent: ServiceContext.Provider,
    wrappingComponentProps: {
      value: {
        translationService: { translate: jest.fn((key) => key) },
        soundService: mockSoundService
      }
    }
  }
);

const selectors = {
  nugget: 'Styled(Button)[data-selector="player-nugget"]',
  playButton: 'Styled(Button)[data-selector="soundplayer-big-button"]',
  backButtonEnabled: 'Styled(Button)[data-selector="player-back-button-enabled"]',
  backButtonDisabled: 'Styled(Button)[data-selector="player-back-button-disabled"]',
  forwardButtonEnabled: 'Styled(Button)[data-selector="player-forward-button-enabled"]',
  forwardButtonDisabled: 'Styled(Button)[data-selector="player-forward-button-disabled"]'
};
const filterPulsating = (wrapper) => wrapper
  .find(selectors.nugget)
  .filterWhere((node) => node.prop('$pulsate') === true);
const filterActive = (wrapper) => wrapper
  .find(selectors.nugget)
  .filterWhere((node) => node.prop('$active') === true);

const getIconName = (wrapper) => wrapper.find(selectors.playButton).prop('icon').type.displayName;

const triggerSoundEvent = (url, event) => {
  return act(() => {
    mockSoundService.getInstance(url).simulate(event);
  });
};

jest.useFakeTimers();

describe('Player component', () => {
  describe('player logic', () => {
    it('triggers onComplete callback when the last clip have finished playing', () => {
      const completionCbMock = jest.fn();
      const wrapper = getWrapper({ onCompleteAll: completionCbMock });
      wrapper.find(selectors.nugget).at(3).invoke('onClick')();
      triggerSoundEvent(audioUrls[3], 'end');
      wrapper.update();
      expect(completionCbMock).toBeCalledTimes(1);
    });
  });

  describe('idle hint', () => {
    it('shows hint to press play and dismisses when a sound is played', () => {
      const wrapper = getWrapper();
      expect(wrapper.find(ToolTip).prop('visible')).toBeFalsy();
      act(() => {
        jest.runOnlyPendingTimers();
      });
      wrapper.update();
      expect(wrapper.find(ToolTip).prop('visible')).toBeTruthy();
      triggerSoundEvent(audioUrls[0], 'play');
      wrapper.update();
      expect(wrapper.find(ToolTip).prop('visible')).toBeFalsy();
    });

    it('doesnt show hint when plays', () => {
      const wrapper = getWrapper();
      expect(wrapper.find(ToolTip).prop('visible')).toBeFalsy();
      triggerSoundEvent(audioUrls[0], 'play');
      wrapper.update();
      act(() => {
        jest.runOnlyPendingTimers();
      });
      wrapper.update();
      expect(wrapper.find(ToolTip).prop('visible')).toBeFalsy();
    });
  });

  describe('play button has corresponding state to sound playing state', () => {
    it('initially displays play icon', () => {
      const wrapper = getWrapper();
      expect(wrapper.find(selectors.playButton).length).toBe(1);
      expect(getIconName(wrapper)).toBe('IconPlay');
    });

    it('switches to pause icon when sound starts playing', () => {
      const wrapper = getWrapper();
      wrapper.find(selectors.playButton).invoke('onClick')();
      expect(getIconName(wrapper)).toBe('IconPlay');
      triggerSoundEvent(audioUrls[0], 'play');
      wrapper.update();
      expect(getIconName(wrapper)).toBe('IconPause');
    });

    it('calls play fn on sound instance with reset flag off when clicked while paused', () => {
      const wrapper = getWrapper();
      triggerSoundEvent(audioUrls[0], 'pause');
      wrapper.update();
      expect(getIconName(wrapper)).toBe('IconPlay');
      wrapper.find(selectors.playButton).invoke('onClick')();
      expect(mockSoundService.getInstance(audioUrls[0]).play).toHaveBeenLastCalledWith({ reset: false });
    });

    it('after finishing a clip should automatically play the next and still have pause icon', () => {
      const wrapper = getWrapper();
      triggerSoundEvent(audioUrls[0], 'end');
      wrapper.update();
      triggerSoundEvent(audioUrls[1], 'play');
      wrapper.update();
      expect(getIconName(wrapper)).toBe('IconPause');
    });

    it('automatically goes to the next clip when failed to play', () => {
      const wrapper = getWrapper();
      triggerSoundEvent(audioUrls[0], 'playerror');
      wrapper.update();
      triggerSoundEvent(audioUrls[1], 'play');
      wrapper.update();
      expect(getIconName(wrapper)).toBe('IconPause');
    });

    it('turns into replay icon after completing the last clip', () => {
      const wrapper = getWrapper();
      wrapper.find(selectors.nugget).at(3).invoke('onClick')();
      triggerSoundEvent(audioUrls[3], 'play');
      wrapper.update();
      triggerSoundEvent(audioUrls[3], 'end');
      wrapper.update();
      expect(getIconName(wrapper)).toBe('IconRetry');
    });

    it('pauses and unpauses on last clip', () => {
      const wrapper = getWrapper();
      wrapper.find(selectors.nugget).at(3).invoke('onClick')();
      triggerSoundEvent(audioUrls[3], 'play');
      wrapper.update();
      triggerSoundEvent(audioUrls[3], 'pause');
      wrapper.update();
      mockSoundService.getInstance(audioUrls[3]).play.mockClear();
      wrapper.find(selectors.playButton).invoke('onClick')();
      expect(mockSoundService.getInstance(audioUrls[3]).play).toBeCalledWith(
        expect.objectContaining({ reset: false })
      );
    });
  });

  describe('side navigation buttons', () => {
    it('renders back and forward navigation buttons in correct states', () => {
      const wrapper = getWrapper();
      expect(wrapper.find(selectors.backButtonDisabled).length).toBe(1);
      expect(wrapper.find(selectors.forwardButtonEnabled).length).toBe(1);
      expect(wrapper.find(selectors.backButtonDisabled).prop('disabled')).toBe(true);
      expect(wrapper.find(selectors.forwardButtonEnabled).prop('disabled')).toBe(false);
      wrapper.find(selectors.nugget).at(3).invoke('onClick')();
      expect(wrapper.find(selectors.backButtonEnabled).prop('disabled')).toBe(false);
      expect(wrapper.find(selectors.forwardButtonDisabled).prop('disabled')).toBe(true);
      triggerSoundEvent(audioUrls[3], 'end');
      wrapper.update();
      expect(wrapper.find(selectors.backButtonEnabled).prop('disabled')).toBe(false);
      expect(wrapper.find(selectors.forwardButtonDisabled).prop('disabled')).toBe(true);
    });

    it('renders back and forward navigation buttons in correct states with single clip', () => {
      const wrapper = getWrapper({ audioUrls: ['single-clip.mp3'] });
      expect(wrapper.find(selectors.backButtonDisabled).length).toBe(1);
      expect(wrapper.find(selectors.forwardButtonDisabled).length).toBe(1);
      expect(wrapper.find(selectors.backButtonDisabled).prop('disabled')).toBe(true);
      expect(wrapper.find(selectors.forwardButtonDisabled).prop('disabled')).toBe(true);
      triggerSoundEvent('single-clip.mp3', 'play');
      wrapper.update();
      expect(wrapper.find(selectors.backButtonEnabled).prop('disabled')).toBe(false);
      expect(wrapper.find(selectors.forwardButtonDisabled).prop('disabled')).toBe(true);
      triggerSoundEvent('single-clip.mp3', 'play');
      wrapper.update();
      expect(wrapper.find(selectors.backButtonEnabled).prop('disabled')).toBe(false);
      expect(wrapper.find(selectors.forwardButtonDisabled).prop('disabled')).toBe(true);
    });

    it('navigates to the necessary clips when back and forward clicked', () => {
      const wrapper = getWrapper();
      // pressing forward button from the initial state switches to the second clip
      wrapper.find(selectors.forwardButtonEnabled).invoke('onClick')();
      expect(mockSoundService.getInstance).toBeCalledWith(audioUrls[1]);
      expect(mockSoundService.getInstance(audioUrls[1]).play).toBeCalledTimes(1);
      // pressing back button from the last clip switches to the previous clip
      wrapper.find(selectors.nugget).at(3).invoke('onClick')();
      wrapper.find(selectors.backButtonEnabled).invoke('onClick')();
      expect(mockSoundService.getInstance).toBeCalledWith(audioUrls[2]);
      expect(mockSoundService.getInstance(audioUrls[2]).play).toBeCalledTimes(1);
      // pressing forward button from the pre-last clip switches not to the next clip
      wrapper.find(selectors.forwardButtonEnabled).invoke('onClick')();
      mockSoundService.getInstance(audioUrls[0]).play.mockClear();
      mockSoundService.getInstance.mockClear();
      expect(mockSoundService.getInstance).not.toBeCalled();

      // pressing forward button from the last clip switches to the first clip
      // for the user, the button is disabled, but the test can invoke the onClick method anyway
      wrapper.find(selectors.forwardButtonDisabled).invoke('onClick')();
      expect(mockSoundService.getInstance).toBeCalledWith(audioUrls[0]);
      expect(mockSoundService.getInstance(audioUrls[0]).play).toBeCalledTimes(1);
    });
  });

  describe('nuggets', () => {
    it('renders one nugget for each audio file loaded', () => {
      const wrapper = getWrapper();
      expect(wrapper.find(selectors.nugget).length).toBe(audioUrls.length);
    });
    it('does not render any nugget as active or pulsating when at audio 0', () => {
      const wrapper = getWrapper();
      expect(filterActive(wrapper).length).toBe(0);
      expect(filterPulsating(wrapper).length).toBe(0);
    });
    it('nugget is neither active nor pulsating when nugget is clicked but audio 0 does not yet play', () => {
      const wrapper = getWrapper();
      wrapper.find(selectors.nugget).at(0).invoke('onClick')();
      expect(filterActive(wrapper).length).toBe(0);
      expect(filterPulsating(wrapper).length).toBe(0);
    });
    it('marks the clicked nugget as pulsating when its corresponding audio starts playing', () => {
      const wrapper = getWrapper();
      wrapper.find(selectors.nugget).at(1).invoke('onClick')();
      triggerSoundEvent(audioUrls[1], 'play');
      wrapper.update();
      const pulsatingNodes = wrapper.find(selectors.nugget).map((node) => node.prop('$pulsate'));
      expect(pulsatingNodes).toEqual([false, true, false, false]);
    });
    it('removes the pulsating when its corresponding audio has finished playing', () => {
      const wrapper = getWrapper();
      wrapper.find(selectors.nugget).at(1).invoke('onClick')();
      triggerSoundEvent(audioUrls[1], 'play');
      wrapper.update();
      triggerSoundEvent(audioUrls[1], 'end');
      wrapper.update();
      const pulsatingNodes = wrapper.find(selectors.nugget).map((node) => node.prop('$pulsate'));
      expect(pulsatingNodes).toEqual([false, false, false, false]);
    });
    /* eslint-disable-next-line max-len */
    it('marks all nuggets up to and including the one clicked as active when its corresponding audio starts playing', () => {
      const wrapper = getWrapper();
      wrapper.find(selectors.nugget).at(2).invoke('onClick')();
      triggerSoundEvent(audioUrls[2], 'play');
      wrapper.update();
      const activeNodes = wrapper.find(selectors.nugget).map((node) => node.prop('$active'));
      expect(activeNodes).toEqual([true, true, true, false]);
    });
    /* eslint-disable-next-line max-len */
    it('when audio stops playing, all active marks are kept and the next nugget is also marked active', () => {
      const wrapper = getWrapper();
      wrapper.find(selectors.nugget).at(2).invoke('onClick')();
      triggerSoundEvent(audioUrls[2], 'play');
      wrapper.update();
      triggerSoundEvent(audioUrls[2], 'end');
      wrapper.update();
      const activeNodes = wrapper.find(selectors.nugget).map((node) => node.prop('$active'));
      expect(activeNodes).toEqual([true, true, true, true]);
    });
    it('resets when all audios have stopped playing', () => {
      const wrapper = getWrapper();
      wrapper.find(selectors.nugget).at(3).invoke('onClick')();
      triggerSoundEvent(audioUrls[3], 'play');
      wrapper.update();
      triggerSoundEvent(audioUrls[3], 'end');
      wrapper.update();
      expect(filterActive(wrapper).length).toBe(4);
      expect(filterPulsating(wrapper).length).toBe(0);
    });
  });
});
