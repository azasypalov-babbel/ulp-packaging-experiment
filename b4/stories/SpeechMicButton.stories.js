import React from 'react';
import { storiesOf } from '@storybook/react';
import { SpeechMicButton } from '../src/components/shared/MicButton/SpeechMicButton';
import { withKnobs, boolean, select } from '@storybook/addon-knobs';

const stories = storiesOf('SpeakingTrainer', module);
stories.addDecorator(withKnobs);

stories.add('Speech Mic Button', () => {
  const showTooltip = boolean('Show tooltip', false);
  const visible = boolean('Visible', true);

  const label = 'Appearance';
  const options = {
    Resting: 'RESTING',
    Listening: 'LISTENING',
    Recording: 'RECORDING',
    Disabled: 'DISABLED'
  };
  const defaultValue = 'RESTING';
  const appearance = select(label, options, defaultValue);

  const translations = {
    tapToSpeak: 'Tap to speak',
    pressToSpeak: 'Press to speak',
    speak: 'Speak now...'
  };

  return (
    <div style={{ margin: '200px' }}>
      <SpeechMicButton
        appearance={appearance}
        showTooltip={showTooltip}
        onTouchEnd={() => { }}
        onTouchStart={() => { }}
        onClick={() => { }}
        visible={visible}
        translations={translations}
      />
    </div>
  );
});
