import React from 'react';
import { SoundPlayer } from '../../../src/components/shared/SoundPlayer';
import { shallow } from 'enzyme';

const mockPlay = jest.fn();

const defaultProps = {
  url: 'http://localhost/test.mp3',
  audio: {
    playSoundWithState: mockPlay,
    playSound: jest.fn(),
    preload: jest.fn(),
    reset: jest.fn(),
    stop: jest.fn()
  }
};

describe('<SoundPlayer />', () => {
  afterEach(() => {
    mockPlay.mockClear();
  });

  test('it renders', () => {
    const wrapper = shallow(<SoundPlayer {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  describe('playOnMount prop', () => {
    test('calls play when mounting', () => {
      shallow(<SoundPlayer {...defaultProps} playOnMount />);
      expect(mockPlay).toHaveBeenCalledTimes(1);
    });
  });

  describe('#triggerSound', () => {
    let wrapper;
    let instance;
    const props = {
      ...defaultProps,
      onEnded: jest.fn(),
      onError: jest.fn()
    };

    beforeEach(() => {
      wrapper = shallow(<SoundPlayer {...props} />);
      instance = wrapper.instance();
      instance.toggleSpeed = jest.fn(() => Promise.resolve());
      instance.triggerSound();
    });

    test('calls toggleSpeed', () => {
      expect(instance.toggleSpeed).toHaveBeenCalledTimes(1);
    });

    test('calls audio#playSoundWithState', () => {
      expect(mockPlay).toHaveBeenCalledWith('http://localhost/test.mp3', {
        playbackRate: 1,
        onEnded: props.onEnded,
        onError: props.onError
      });
    });
  });

  describe('#toggleSpeed', () => {
    let wrapper;
    let instance;
    let userPlayCount;

    beforeEach(() => {
      wrapper = shallow(<SoundPlayer {...defaultProps} />);
      instance = wrapper.instance();
      userPlayCount = instance.state.userPlayCount;
    });

    describe('on even call', () => {
      test('does not change playbackSpeed but increments userPlayCount', async () => {
        expect.assertions(2);
        await instance.toggleSpeed();
        expect(instance.state.playbackSpeed).toBe(1);
        expect(instance.state.userPlayCount).toBe(userPlayCount + 1);
      });
    });

    describe('on odd calls', () => {
      test('changes playbackSpeed and increments userPlayCount', async () => {
        expect.assertions(2);
        await instance.toggleSpeed();
        expect(instance.state.playbackSpeed).toBe(1);
        expect(instance.state.userPlayCount).toBe(userPlayCount + 1);
      });
    });
  });

  describe('with render prop', () => {
    const mockRender = jest.fn();

    test('calls render prop', () => {
      shallow(<SoundPlayer {...defaultProps} render={mockRender} />);
      expect(mockRender.mock.calls[0][0]).toMatchSnapshot();
    });
  });
});
