import React, { useCallback, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { getDisplayName } from '../getDisplayName';
import { ServiceContext } from '../shared/withServices';
import { useSoundPlayer } from '../Trainer/shared/useSoundPlayer';
import { PlayStates } from '../../services/soundService';

/**
 * @deprecated in favour of `useSoundPlayer/useAutoRateSoundPlayer` and `useFeedbackSounds`.
 */
export const withAudio = (options = { name: 'audio' }) => (WrappedComponent) => {
  const WithAudio = (props) => {
    const { soundService } = useContext(ServiceContext);
    const [state, setState] = useState({ soundUrl: null, options });
    const instance = useSoundPlayer(state.soundUrl, true);
    const playbackRate = instance?.getPlaybackRate() || 1;
    const duration = instance?.getDuration() || null;
    const playState = instance?.getState() || PlayStates.INITIAL;
    const playSoundWithState = useCallback((soundUrl, options) => {
      setState({ soundUrl, options });
    }, []);
    useEffect(() => {
      if (state.soundUrl !== null) {
        instance?.play({ playbackRate: state.options?.playbackRate });
      }
    }, [state, instance]);
    useEffect(() => {
      const { options = {} } = state;
      if (playState !== PlayStates.INITIAL && playState !== PlayStates.INITIATED) {
        if (playState === PlayStates.PLAYING) {
          options.onPlay?.();
        } else {
          const callback = options[playState === PlayStates.FAILED ? 'onError' : 'onEnded'];
          callback?.();
        }
      }
    }, [state, playState]);
    const cleanup = useCallback(() => {
      instance?.cleanup();
    }, [instance]);
    const passProps = {
      ...props,
      [options.name]: {
        duration,
        playbackRate,
        isPlaying: playState === PlayStates.PLAYING,
        isEnded: playState === PlayStates.COMPLETED,
        playSound: soundService.play,
        playSoundWithState,
        preload: soundService.preload,
        stop: soundService.stop,
        cleanup
      }
    };
    useEffect(() => {
      return () => {
        soundService.stop();
      };
    }, [soundService]);
    return <WrappedComponent {...passProps} />;
  };

  WithAudio.displayName = `withAudio(${getDisplayName(WrappedComponent)})`;
  return WithAudio;
};

/**
 * @deprecated in favour of `useSoundPlayer/useAutoRateSoundPlayer` and `useFeedbackSounds`.
 */
export default withAudio;

export const audioPropTypes = PropTypes.shape({
  isEnded: PropTypes.bool,
  isPlaying: PropTypes.bool,
  playSound: PropTypes.func.isRequired,
  playSoundWithState: PropTypes.func.isRequired,
  preload: PropTypes.func.isRequired,
  cleanup: PropTypes.func,
  playbackRate: PropTypes.number,
  stop: PropTypes.func.isRequired,
  duration: PropTypes.number
});
