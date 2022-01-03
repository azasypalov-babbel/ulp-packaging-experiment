import React from 'react';
import { ReviewMenuScreen } from '../../../../src/components/Review/ReviewMenuScreen/ReviewMenuScreen';
import { shallow } from 'enzyme';

const onSelectInteraction = jest.fn();

const defaultProps = {
  interactions: ['flashcard', 'listen', 'speak', 'write'],
  onSelectInteraction,
  translations: {
    title: 'How would you like to review?',
    speak: 'Speak',
    write: 'Write',
    listen: 'Listen',
    flashcard: 'Flashcards'
  }
};

describe('<ReviewMenuScreen />', () => {
  test('it renders', () => {
    const component = shallow(
      <ReviewMenuScreen {...defaultProps} />
    );

    expect(component).toMatchSnapshot();
  });
});
