import React from 'react';
import FeedbackMessage from '../../../../src/components/Lesson/LessonEndScreen/FeedbackMessage';
import { shallow } from 'enzyme';

const defaultProps = {
  displayName: 'Christian',
  learnLanguageAlpha3: 'FRA',
  grade: 'high',
  feedbackMessageText: `Fantastique, %{display_name} !`
};

describe('<FeedbackMessage />', () => {
  test('it renders', () => {
    const component = shallow(<FeedbackMessage {...defaultProps} />);
    expect(component).toMatchSnapshot();
  });
});
