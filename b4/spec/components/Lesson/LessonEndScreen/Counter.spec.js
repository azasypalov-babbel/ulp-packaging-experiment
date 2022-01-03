import React from 'react';
import Counter, { animateValue } from '../../../../src/components/Lesson/LessonEndScreen/Counter';
import { shallow } from 'enzyme';

const defaultProps = {
  value: 10
};

jest.useFakeTimers();

describe('<Counter />', () => {
  test('it renders', () => {
    const component = shallow(
      <Counter {...defaultProps} />
    );

    // Fast-forward until all timers have been executed
    jest.runAllTimers();
    // Forces a re-render since shallow won't do it by itself on changing state
    component.update();

    expect(component).toMatchSnapshot();
  });

  describe('#animateValue', () => {
    test('it calls onCompleted when count reaches value. (zero value)', () => {
      const onCountEnd = jest.fn();
      animateValue(0, () => {}, onCountEnd);
      expect(onCountEnd).toHaveBeenCalled();
    });

    test('it calls onCompleted when count reaches value.', () => {
      const onCountEnd = jest.fn();
      animateValue(1, () => {}, onCountEnd);
      jest.runOnlyPendingTimers();
      expect(onCountEnd).toHaveBeenCalled();
    });
  });
});
