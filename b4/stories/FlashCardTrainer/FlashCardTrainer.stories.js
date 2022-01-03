import React from 'react';
import { storiesOf } from '@storybook/react';
import { FlashCardTrainer } from '../../src/components/Trainer/FlashCardTrainer/FlashCardTrainer';

import { withMockServicesProvider } from '../decorators/withServices';
import { action } from '@storybook/addon-actions';
import withStore from '../decorators/withStore';

const stories = storiesOf('FlashCardTrainer', module)
  .addDecorator(withMockServicesProvider)
  .addDecorator(withStore);

const props = {
  audio: {
    playSound: action('playSound'),
    playSoundWithState: action('playSoundWithState'),
    preload: () => {},
    playbackRate: 1,
    stop: () => {},
    reset: () => {}
  },
  item: {
    id: '549f9ecf012e7f3b636ec9e4ac5a0d10',
    learnLanguageText: 'One',
    displayLanguageText: 'Two',
    sound: {
      id: 'd3572193477785b1bc030cdf61ec777c'
    },
    image: {
      id: 'd3572193477785b1bc030cdf61ec777c'
    }
  },
  locale: 'en',
  learnLanguageAlpha3: 'DEU',
  mediaUrlService: {
    imageURL: () => 'https://placekitten.com/200/300',
    soundURL: (val) => `http://localhost/${val}.mp3`
  },
  onToggleShortcuts: () => {},
  onContinue: action('onContinue'),
  translations: {
    title: 'Know the phrase?',
    buttonKnown: 'Yes',
    buttonUnknown: 'No'
  }
};

stories.add('Flash Card Trainer', () => {
  return (<FlashCardTrainer {...props} />);
});
