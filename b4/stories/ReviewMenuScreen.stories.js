import React from 'react';
import { storiesOf } from '@storybook/react';
import { ReviewMenuScreen } from '../src/components/Review/ReviewMenuScreen/ReviewMenuScreen';

import { action } from '@storybook/addon-actions';

const stories = storiesOf('ReviewMenuScreen', module);

const props = {
  interactions: ['flashcard', 'listen', 'speak', 'write'],
  onSelectInteraction: action('onSelectInteraction'),
  translations: {
    title: 'How would you like to review?',
    speak: 'Speak',
    write: 'Write',
    listen: 'Listen',
    flashcard: 'Flashcards'
  }
};

stories.add('Review Menu Screen', () => {
  return <ReviewMenuScreen {...props} />;
});
