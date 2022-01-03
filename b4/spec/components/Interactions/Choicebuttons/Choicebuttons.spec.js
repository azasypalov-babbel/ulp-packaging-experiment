import React from 'react';
import { shallow } from 'enzyme';
import { Choicebuttons } from '../../../../src/components/Interactions/Choicebuttons/Choicebuttons';


const defaultProps = {
  targetChoices: [
    {
      sentence: 'k',
      correct: false
    },
    {
      sentence: 'K',
      correct: true
    }
  ],
  onAttempt: jest.fn()
};

describe('Choicebuttons', () => {
  let component;

  beforeEach(() => {
    component = shallow(<Choicebuttons {...defaultProps} />);
  });

  test('should render correctly', () => {
    expect(component).toMatchSnapshot();
  });

  test('should execute callback props when clicking one of the button', () => {
    component.find('Choicebutton').first().simulate('click');

    expect(defaultProps.onAttempt).toHaveBeenCalledTimes(1);
  });
});

