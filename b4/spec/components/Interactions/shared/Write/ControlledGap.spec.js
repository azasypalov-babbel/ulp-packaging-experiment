import React from 'react';
import { shallow } from 'enzyme';
import * as redux from 'react-redux'
import ControlledGap from '../../../../../src/components/Interactions/shared/Write/ControlledGap';
import TextGap from '../../../../../src/components/Interactions/shared/Write/TextGap';

const spy = jest.spyOn(redux, 'useSelector')
spy.mockReturnValue({ zendeskWidget: { isOpen: false } })

const defaultProps = {
  active: true,
  latestText: 'abc',
  targetChoices: [
    { sentence: 'answer', correct: true, oddSolution: false },
    { sentence: 'alternative answer', correct: true, oddSolution: false }
  ],
  attempt: {
    text: 'answer',
    solved: false,
    feedbackType: 'CORRECT',
    inputText: 'abc',
    mistaken: false,
    pending: false,
    number: 1
  },
  onCheat: () => {},
  feedbackDismissed: false,
  setFeedbackDismissed: jest.fn()
};

describe('Controlled Gap', () => {
  beforeEach(() => {
  });

  describe('renders', () => {
    test('html when active', () => {
      const component = shallow(<ControlledGap {...defaultProps} />);
      expect(component).toMatchSnapshot();
    });

    test('html when not active', () => {
      const component = shallow(<ControlledGap {...defaultProps} active={false} />);
      expect(component).toMatchSnapshot();
    });

    test('a TextGap with props', () => {
      const component = shallow(<ControlledGap {...defaultProps} />);
      const textGap = component.find(TextGap);

      expect(textGap.prop('text')).toBe(defaultProps.latestText);
      expect(textGap.prop('targetText')).toBe(defaultProps.targetChoices[0].sentence);
      expect(textGap.prop('alternativeText')).toBe(defaultProps.targetChoices[1].sentence);
    });
  });
});
