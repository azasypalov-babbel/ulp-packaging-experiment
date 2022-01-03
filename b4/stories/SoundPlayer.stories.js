import React from 'react';
import { storiesOf } from '@storybook/react';
import SoundPlayer from '../src/components/shared/SoundPlayer';
import { withMockServicesProvider } from './decorators/withServices';
import withAudio from '../src/components/shared/withAudio';

const stories = storiesOf('SoundPlayer', module);

stories.addDecorator(withMockServicesProvider);

const SoundPlayerWithAudio = withAudio()(SoundPlayer);

stories.add('Sound Player', () => {
  return <SoundPlayerWithAudio url="testSound" />;
});
