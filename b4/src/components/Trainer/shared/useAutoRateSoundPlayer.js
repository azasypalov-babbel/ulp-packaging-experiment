import { useCallback, useEffect, useRef } from 'react';
import { PLAYBACK_RATE_NORMAL, PLAYBACK_RATE_SLOW } from './constants';
import { useSoundPlayer } from './useSoundPlayer';

const invertPlaybackRate = (rate) => {
  if (rate === null) return PLAYBACK_RATE_NORMAL;
  return rate === PLAYBACK_RATE_NORMAL
    ? PLAYBACK_RATE_SLOW : PLAYBACK_RATE_NORMAL;
};

export const useAutoRateSoundPlayer = (audioUrl) => {
  const instance = useSoundPlayer(audioUrl);
  const lastPlaybackRateRef = useRef(null);
  const playAutoRate = useCallback(() => {
    instance?.play({
      playbackRate: invertPlaybackRate(lastPlaybackRateRef.current)
    });
    lastPlaybackRateRef.current = instance?.getPlaybackRate() || null;
  }, [instance]);
  useEffect(() => {
    lastPlaybackRateRef.current = null;
  }, [audioUrl]);
  return {
    ...instance,
    isSlowPlayback: instance?.getPlaybackRate() === PLAYBACK_RATE_SLOW,
    playAutoRate
  };
};
