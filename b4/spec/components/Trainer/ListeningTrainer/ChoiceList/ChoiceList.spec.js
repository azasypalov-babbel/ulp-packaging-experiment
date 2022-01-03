import React from 'react';
import ChoiceList from '../../../../../src/components/Trainer/ListeningTrainer/ChoiceList/ChoiceList';
import { shallow } from 'enzyme';

describe('<ChoiceList />', () => {
  const defaultProps = {
    showChoiceItems: true,
    correctText: 'One',
    items: ['Two', 'Three', 'Four', 'Five'],
    onClick: () => {}
  };

  test('renders', () => {
    const component = shallow(<ChoiceList {...defaultProps} />);
    expect(component).toMatchSnapshot();
  });

  describe('with correct attempt', () => {
    test('renders', () => {
      const component = shallow(<ChoiceList {...defaultProps} attemptedText="One" />);
      expect(component).toMatchSnapshot();
    });
  });

  describe('with incorrect attempt', () => {
    test('renders', () => {
      const component = shallow(<ChoiceList {...defaultProps} attemptedText="Two" />);
      expect(component).toMatchSnapshot();
    });
  });
});
