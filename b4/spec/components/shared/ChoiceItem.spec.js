import React from 'react';
import { ChoiceItem } from '../../../src/components/shared/ChoiceItem/ChoiceItem';
import { mountWithTheme } from './themeMock';

describe('<ChoiceItem />', () => {
  const defaultProps = {
    onClick: () => {}
  };

  test('it renders', () => {
    const wrapper = mountWithTheme(<ChoiceItem {...defaultProps}>click</ChoiceItem>);
    expect(wrapper).toMatchSnapshot();
  });

  describe('when choice item is pressed', () => {
    test('that is-active class is added', () => {
      const wrapper = mountWithTheme(<ChoiceItem {...defaultProps} pressed>click</ChoiceItem>);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('with disabled', () => {
    test('it renders', () => {
      const wrapper = mountWithTheme(<ChoiceItem {...defaultProps} disabled>click</ChoiceItem>);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('with correctFeedback', () => {
    test('it renders', () => {
      const wrapper = mountWithTheme(<ChoiceItem {...defaultProps} correctFeedback>click</ChoiceItem>);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('with mistakeFeedback', () => {
    test('it renders', () => {
      const wrapper = mountWithTheme(<ChoiceItem {...defaultProps} mistakeFeedback>click</ChoiceItem>);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('with keyboardHintComponent', () => {
    test('it renders', () => {
      const keyboardHintComponent = <span>hint</span>;
      const wrapper = mountWithTheme(
        <ChoiceItem {...defaultProps} keyboardHintComponent={keyboardHintComponent}>click</ChoiceItem>
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
