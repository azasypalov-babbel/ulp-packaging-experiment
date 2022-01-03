import React from 'react';
import { FlashCard } from '../../../../src/components/Trainer/FlashCardTrainer/Flashcard/FlashCard';
import { mountWithTheme } from '../../shared/themeMock';

describe('<FlashCard />', () => {
  test('it renders', () => {
    const wrapper = mountWithTheme(<FlashCard imageUrl="someUrl" />);
    expect(wrapper).toMatchSnapshot();
  });

  describe('with keyboardHintComponent', () => {
    test('it renders', () => {
      const keyboardHintComponent = <span>hint</span>;
      const wrapper = mountWithTheme(
        <FlashCard imageUrl="someUrl" keyboardHintComponent={keyboardHintComponent} />
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
