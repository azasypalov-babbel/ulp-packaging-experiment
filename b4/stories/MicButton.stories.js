import React from 'react';
import { storiesOf } from '@storybook/react';
import MicButton from '../src/components/shared/MicButton/MicButton';
import { withKnobs, boolean } from '@storybook/addon-knobs';

const stories = storiesOf('SpeakingTrainer', module);
stories.addDecorator(withKnobs);

stories.add('Mic Button', () => {
  const disabled = boolean('Disabled', false);
  const isListening = boolean('Is listening', false);
  const isUserSpeaking = boolean('is User Speaking', false);
  const onClick = () => {};

  return <MicButton isListening={isListening} isUserSpeaking={isUserSpeaking} onClick={onClick} disabled={disabled} />
});
