import React from 'react';
import { shallow } from 'enzyme';

import { SkipTrainerControls } from '../../../src/components/Sequence/SkipTrainerControls';


const controlProps = {
  trainers: [{}, {}, {}, {}],
  currentTrainerIndex: 2,
  navigate: jest.fn(),
  mayUseCheatControls: true,
  renderSkipAreas: true,
  children: '<p>Some Node</p>'
};

describe('Skip Buttons', () => {
  describe('renderSkipAreas is true', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(<SkipTrainerControls {...controlProps}/>);
    });

    it('skip buttons will be rendered', () => {
      expect(wrapper.find('SkipArea')).toHaveLength(2);
    });

    it('one buttons goes forward, one goes backward', () => {
      expect(wrapper.find('SkipArea').first().prop('direction')).toBe('backward');
      expect(wrapper.find('SkipArea').last().prop('direction')).toBe('forward');
    });
  });

  describe('will be not rendered if renderSkipAreas is false', () => {
    let wrapper;
    const localProps = {
      ...controlProps,
      renderSkipAreas: false
    };

    beforeEach(() => {
      wrapper = shallow(<SkipTrainerControls {...localProps}/>);
    });

    it('skip buttons will be not rendered', () => {
      expect(wrapper.find('SkipArea')).toHaveLength(0);
    });
  });
});

describe('Skip Trainer Functionality', () => {
  describe('is enabled if mayUseCheatControls is true', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(<SkipTrainerControls {...controlProps}/>);
    });

    it('skip buttons will be rendered', () => {
      expect(wrapper.find('SkipArea')).toHaveLength(2);
    });

    it('children will be rendered', () => {
      expect(wrapper.debug().match(/p/)[0]).toBe('p');
    });

    it('backward navigation is enabled on first button', () => {
      wrapper.find('SkipArea').first().simulate('click');
      expect(controlProps.navigate).toHaveBeenCalledTimes(1);
      expect(controlProps.navigate).toHaveBeenCalledWith(1);
    });

    it('forward navigation is enabled on second button', () => {
      wrapper.find('SkipArea').last().simulate('click');
      expect(controlProps.navigate).toHaveBeenCalledTimes(1);
      expect(controlProps.navigate).toHaveBeenCalledWith(3);
    });
  });

  describe('is disabled if mayUseCheatControls is false', () => {
    let wrapper;
    const localProps = {
      ...controlProps,
      mayUseCheatControls: false
    };

    beforeEach(() => {
      wrapper = shallow(<SkipTrainerControls {...localProps}/>);
    });

    it('skip buttons will be not rendered', () => {
      expect(wrapper.find('SkipArea')).toHaveLength(0);
    });

    it('but it renders the children', () => {
      expect(wrapper.debug().match(/p/)[0]).toBe('p');
    });
  });
});
