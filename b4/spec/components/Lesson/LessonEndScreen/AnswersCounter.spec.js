import React from 'react';
import AnswersCounter from '../../../../src/components/Lesson/LessonEndScreen/AnswersCounter';
import { shallow } from 'enzyme';

describe('Answers Counter', () => {
  test('it renders', () => {
    const props = {
      onCounterEnd: jest.fn(),
      correctAnswersText: 'Answered correctly:',
      correctItemsCount: 8,
      totalItemsCount: 12
    };
    const component = shallow(
      <AnswersCounter {...props} />
    );

    expect(component).toMatchSnapshot();
  });
});
