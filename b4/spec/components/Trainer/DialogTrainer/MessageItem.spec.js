import React from 'react';
import { shallow } from 'enzyme';
import MessageItem from '../../../../src/components/Trainer/DialogTrainer/MessageItem';

const defaultProps = {
  children: 'children',
  secondaryText: '"Y sho era" el **mejor**',
  active: true,
  onClick: jest.fn(),
  position: 'left'
};

describe('<MessageItem />', () => {
  test('it renders', () => {
    const wrapper = shallow(<MessageItem {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  describe('when secondary text exists', () => {
    test('renders formatted string', () => {
      const wrapper = shallow(<MessageItem {...defaultProps} />);
      const formattedText = wrapper
        .find('[data-selector="item-translation"]')
        .prop('dangerouslySetInnerHTML')['__html'];

      expect(formattedText).toEqual('<i>Y sho era</i> el <b>mejor</b>');
    });
  });

  describe('when secondary text does not exists', () => {
    test('does not render the text', () => {
      const props = {
        ...defaultProps,
        secondaryText: undefined
      };
      const wrapper = shallow(<MessageItem {...props} />);

      expect(wrapper.find('[data-selector="item-translation"]').exists()).toBeFalsy();
    });
  });
});

