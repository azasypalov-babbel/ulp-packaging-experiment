import React from 'react';
import { storiesOf } from '@storybook/react';
import { MicPermission } from '../../src/components/shared/SpeechRecognition/MicPermission';

const stories = storiesOf('Speech Recognition', module);

stories.add('Mic Permission', () => {
  const translations = {
    body: 'To practice speaking, please click "Allow" in Chrome so we can use your microphone.',
    button: 'Continue',
    title: 'Turn on your mic'
  };

  return <MicPermission
    isReview={false}
    continueEnabled
    onClick={() => {}}
    dataSelector={''}
    translations={translations}
  />;
});
