import React from 'react';
import { shallow } from 'enzyme';
import SpeakItem from '../../../../src/components/Trainer/DialogTrainer/SpeakItem';

const defaultProps = {
  text: '"Y sho era" el **mejor**'
};

describe('<SpeakItem />', () => {
  test('it renders', () => {
    const wrapper = shallow(<SpeakItem {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });
});
