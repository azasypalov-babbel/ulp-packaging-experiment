import React from 'react';
import { IconButton } from '../../../../src/components/shared/IconButton/IconButton';
import { shallow } from 'enzyme';

describe('<IconButton />', () => {
  describe('<IconButton positive iconName="CheckIcon" />', () => {
    test('it renders', () => {
      const wrapper = shallow(<IconButton positive iconName="CheckIcon"/>);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('<IconButton negative iconName="CrossIcon" />', () => {
    test('it renders', () => {
      const wrapper = shallow(<IconButton negative iconName="CrossIcon" />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('<IconButton iconName="KeyboardIcon" />', () => {
    test('it renders', () => {
      const wrapper = shallow(<IconButton iconName="KeyboardIcon"/>);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('<IconButton /> with keyboardHintComponent', () => {
    const KeyboardHintComponent = () => <span>Hint</span>;
    test('it renders', () => {
      const wrapper = shallow(<IconButton
        iconName="KeyboardIcon"
        keyboardHintComponent={<KeyboardHintComponent />}
      />);

      expect(wrapper.find(KeyboardHintComponent)).toHaveLength(1);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
