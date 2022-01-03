import React from 'react';
import { act } from 'react-dom/test-utils';
import { withAudio } from '../../../src/components/shared/withAudio';

import { mount } from 'enzyme';
import { withServicesProvider } from '../../../src/components/shared/withServices';
import soundService from '../../../src/services/soundService';

jest.mock('../../../src/services/soundService');

const Component = () => <div />;
const Provider = withServicesProvider(() => ({ soundService }))(({ children }) => <>{children}</>);
const WrappedComponent = withAudio()(Component);

const mockUnbind = jest.fn();

describe('withAudio HOC', () => {
  const options = {
    onPlay: jest.fn(),
    playbackRate: 1
  };

  let wrapper;

  beforeEach(() => {
    mockUnbind.mockClear();
    wrapper = mount(<WrappedComponent />, { wrappingComponent: Provider });
  });

  test('passes audio prop to component', () => {
    expect(wrapper.find(Component).props().audio).toEqual({
      isPlaying: false,
      isEnded: false,
      playbackRate: 1,
      duration: null,
      playSound: expect.anything(),
      playSoundWithState: expect.anything(),
      preload: expect.anything(),
      cleanup: expect.anything(),
      stop: expect.anything()
    });
  });

  describe('#playSound', () => {
    test('calls soundService#play method with supplied options', () => {
      const soundId = 'doesnt_matter.mp3';

      wrapper.find(Component).prop('audio').playSound(soundId, options);
      expect(soundService.play.mock.calls[0]).toMatchSnapshot();
    });
  });

  describe('#playSoundWithState', () => {
    test('calls soundService#play method with extended options', () => {
      const soundId = 'doesnt_matter.mp3';
      // reset initial render calls
      soundService.getInstance.mockClear();

      act(() => {
        wrapper.find(Component).prop('audio').playSoundWithState(soundId, options);
      });
      expect(soundService.getInstance.mock.calls[0]).toEqual([soundId]);
      expect(soundService.getInstance(soundId).play.mock.calls[0]).toMatchSnapshot();
    });
  });

  describe('with custom name option', () => {
    it('should expose audio state as custom named prop', () => {
      const WrappedComponentWithName = withAudio({ name: 'customAudio' })(Component);

      const wrapper = mount(<WrappedComponentWithName />,  { wrappingComponent: Provider });

      expect(wrapper.find(Component).prop('customAudio')).toEqual({
        isPlaying: false,
        isEnded: false,
        playbackRate: 1,
        duration: null,
        playSound: expect.anything(),
        playSoundWithState: expect.anything(),
        cleanup: expect.anything(),
        preload: expect.anything(),
        stop: expect.anything()
      });
    });
  });
});
