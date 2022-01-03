import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import { ListeningTrainer } from '../../src/components/Trainer/ListeningTrainer/ListeningTrainer';

import { withMockServicesProvider } from '../decorators/withServices';
import withStore from '../decorators/withStore';
import withAudio from '../../src/components/shared/withAudio';

const stories = storiesOf('ListeningTrainer', module)
  .addDecorator(withStore)
  .addDecorator(withMockServicesProvider);

const ListeningTrainerWithAudio = withAudio()(ListeningTrainer);

const getProps = () => ({
  item: {
    id: '549f9ecf012e7f3b636ec9e4ac5a0d10',
    learnLanguageText: 'Eins',
    displayLanguageText: 'One',
    sound: {
      id: 'd3572193477785b1bc030cdf61ec777c'
    }
  },
  showChoiceItems: boolean('showChoiceItems', false),
  onUserTriggeredSound: action('onUserTriggeredSound'),
  onContinue: action('onContinue'),
  onChoiceItemClick: () => {},
  choiceItemsList: [
    { learnLanguageText: 'Zwei', displayLanguageText: 'Two' },
    { learnLanguageText: 'Drei', displayLanguageText: 'Three' },
    { learnLanguageText: 'Fear', displayLanguageText: 'Four' },
    { learnLanguageText: 'Funf', displayLanguageText: 'Five' }
  ],
  translations: {
    attemptFeedback: {
      negativeFeedback: 'Keep working on!',
      positiveFeedback: 'Fantastic!'
    },
    continueBtn: 'Continue',
    instruction: 'Listen to the phrase'
  },
  mediaUrlService: {
    soundURL: (val) => `http://localhost/${val}.mp3`
  },
  onSoundPlayerEnded: () => action('Sound player ended'),
  onSoundPlayerError: () => action('Sound player error'),
  onToggleShortcuts: action('onToggleShortcuts')
});

stories.add('ListeningTrainer', () => {
  const props = getProps();
  return <ListeningTrainerWithAudio {...props} />;
});

