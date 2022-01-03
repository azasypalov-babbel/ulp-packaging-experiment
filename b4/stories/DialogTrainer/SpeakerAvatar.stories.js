import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, select, boolean } from '@storybook/addon-knobs';
import SpeakerAvatar from '../../src/components/Trainer/DialogTrainer/SpeakerAvatar';

const stories = storiesOf('Dialog Trainer', module);
stories.addDecorator(withKnobs);

stories.add('Speaker Avatar', () => {
  const label = 'Speaker Role';
  const options = {
    M1: 'm1',
    M2: 'm2',
    F1: 'f1',
    F2: 'f2',
    N1: 'n1'
  };

  const defaultValue = 'n1';

  const props = {
    speakerRole: select(label, options, defaultValue),
    isSpeaking: boolean('is speaking', true)
  };

  return <SpeakerAvatar {...props} />;
});
