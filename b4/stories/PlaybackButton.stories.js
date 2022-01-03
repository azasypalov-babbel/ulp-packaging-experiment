import React, { useCallback, useRef, useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean, number, select } from '@storybook/addon-knobs';
import PlayButton from '../src/components/shared/PlayButton';

const stories = storiesOf('PlaybackButton', module);

stories.add('PlaybackButton', () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const clickActionRef = useRef(action('play-sound'));
  const duration = number('duration', 1000);
  const isSlowPlayback = boolean('slow playback', false);
  const handleClick = useCallback((...args) => {
    clickActionRef.current(...args);
    setIsPlaying(true);
    const timeout = setTimeout(() => {
      setIsPlaying(false);
    }, duration * (isSlowPlayback ? 1.5 : 1));
    return () => { clearTimeout(timeout); };
  }, [duration, isSlowPlayback]);
  const sizes = ['jumbo', 'large', 'regular', 'small'];
  return (
    <PlayButton
      size={select('size', sizes, 'regular')}
      onClick={handleClick}
      isPlaying={isPlaying}
      isSlowPlayback={isSlowPlayback}
      duration={duration * (isSlowPlayback ? 1.5 : 1)}
    />
  );
});
