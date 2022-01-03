import React from 'react';
import PlayButton from '../../../src/components/shared/PlayButton';
import { shallow } from 'enzyme';

describe('<PlayButton />', () => {
  test('it renders', () => {
    const wrapper = shallow(<PlayButton />);
    expect(wrapper).toMatchSnapshot();
  });

  describe('with isPlaying prop', () => {
    test('it renders', () => {
      const wrapper = shallow(<PlayButton isPlaying />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('with disabled prop', () => {
    test('it renders', () => {
      const wrapper = shallow(<PlayButton disabled />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('with isSlowPlayback prop', () => {
    describe('and isPlaying', () => {
      test('renders StyledPlayButton', () => {
        const wrapper = shallow(<PlayButton isSlowPlayback isPlaying />);
        expect(wrapper).toMatchSnapshot();
      });
    });

    describe('and !isPlaying', () => {
      test('renders', () => {
        const wrapper = shallow(<PlayButton isSlowPlayback />);
        expect(wrapper).toMatchSnapshot();
      });
    });
  });
});
