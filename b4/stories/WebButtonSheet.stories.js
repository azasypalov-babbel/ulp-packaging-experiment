import React from 'react';
import { storiesOf } from '@storybook/react';

import withStore from './decorators/withStore';
import { withKnobs } from '@storybook/addon-knobs';
import { WebButtonSheet } from '../src/components/Interactions/Fillin/WebButtonSheet';

import { action } from '@storybook/addon-actions';

const stories = storiesOf('Sheets', module)
  .addDecorator(withKnobs)
  .addDecorator(withStore);

stories.add('WebButtonSheet', () => {
  const translations = {
    typingTips: 'typing tips',
    solution: 'solution',
    hint: 'hint'
  };

  const props = {
    onTransliterationToggled: action('transliteration-toggle-clicked'),
    track: action('track-called'),
    isTransliterationTableSupported: true,
    nextHintLevel: 'HINT',
    onHint: action('hint-clicked'),
    translations
  };

  return (
    <WebButtonSheet {...props} />
  );
});
