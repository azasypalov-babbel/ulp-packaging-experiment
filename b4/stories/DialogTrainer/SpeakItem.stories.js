import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs';
import SpeakItem from '../../src/components/Trainer/DialogTrainer/SpeakItem';


const stories = storiesOf('Dialog Trainer', module);
stories.addDecorator(withKnobs);

stories.add('Speak Item', () => {
  const label = 'State';
  const options = {
    default: 'default',
    active: 'active',
    success: 'success',
    error: 'error'
  };
  const defaultValue = 'default';

  const props = {
    text: text('translation', 'Use the input below to add your custom translation'),
    state: select(label, options, defaultValue),
    onClick: () => {}
  };

  return (
    <SpeakItem {...props} />
  );
});
