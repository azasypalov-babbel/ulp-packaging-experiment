import React from 'react';
import { shallow } from 'enzyme';
import MessageBlock from '../../../../src/components/Trainer/DialogTrainer/MessageBlock';

const props = {
  speakerRole: 'n1',
  children: 'learn language',
  secondaryText: 'display language',
  position: 'right',
  onClick: jest.fn(),
  active: false
};

describe('<MessageBlock />', () => {
  test('it renders', () => {
    const wrapper = shallow(<MessageBlock {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});

