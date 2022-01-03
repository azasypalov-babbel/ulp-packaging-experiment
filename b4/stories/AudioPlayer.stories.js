import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { select, boolean, number } from '@storybook/addon-knobs';

import { PlayButton, PlayerButtons } from '../src/components/Player';
import { NuggetsSoundNavigation } from '../src/components/Player/NuggetsSoundNavigation';
import Player from '../src/components/Player/Player';
import { withMockServicesProvider } from './decorators/withServices';

const stories = storiesOf('AudioPlayer', module);
stories.addDecorator(withMockServicesProvider);

stories.add('Play, back and forward buttons', () => {
  const [playState, setPlayState] = useState('paused');
  const playButton = (
    <PlayButton
      onClick={() => setPlayState((st) => (st === 'playing' ? 'paused' : 'playing'))}
      disabled={false}
      playState={playState}
    />
  );
  return <PlayerButtons onNavigate={action('navigated')} playButton={playButton} />;
});

stories.add('Play button', () => {
  return (
    <PlayButton
      onClick={action('clicked')}
      disabled={boolean('disabled')}
      playState={select('play state', ['playing', 'ended', 'paused'], 'paused')}
    />
  );
});

stories.add('Nuggets navigation', () => {
  const itemsCount = number('Amount of nuggets', 3, { max: 30, min: 1 });
  return (
    <NuggetsSoundNavigation
      onNavigate={action('navigated')}
      itemsCount={itemsCount}
      activeItemIndex={number('Active nugget', 3, { max: itemsCount, min: 1 })}
      playing={boolean('Playing audio', false)}
    />
  );
});

stories.add('Player', () => {
  return (
    <Player
      audioUrls={[
        'https://sounds.babbel.com/v1.0.0/sounds/d3572193477785b1bc030cdf61ec777c/normal.mp3',
        'https://sounds.babbel.com/v1.0.0/sounds/d3572193477785b1bc030cdf61ec777c/normal.mp3',
        'https://sounds.babbel.com/v1.0.0/sounds/d3572193477785b1bc030cdf61ec777c/normal.mp3',
        'https://sounds.babbel.com/v1.0.0/sounds/d3572193477785b1bc030cdf61ec777c/normal.mp3',
        'https://sounds.babbel.com/v1.0.0/sounds/d3572193477785b1bc030cdf61ec777c/normal.mp3',
        'https://sounds.babbel.com/v1.0.0/sounds/d3572193477785b1bc030cdf61ec777c/normal.mp3'
      ]}
    />
  );
});
