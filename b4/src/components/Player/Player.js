import { Stack } from '@lessonnine/design-system.lib';
import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { PlayerButtons } from './PlayerButtons';
import { PlayButton } from './PlayButton';
import { NuggetsSoundNavigation } from './NuggetsSoundNavigation';
import { useSoundPlayer } from '../Trainer/shared/useSoundPlayer';
import ToolTip from '../shared/ToolTip';
import { checks, PlayStates } from '../../services/soundService';
import { useMounted } from '../shared/hooks/useMounted';
import { ServiceContext } from '../shared/withServices';

const StyledTooltip = styled(ToolTip)`
  z-index: 10;
`;

export const Player = ({ audioUrls, disabled, onCompleteAll = () => {} }) => {
  const { translationService: { translate } } = useContext(ServiceContext);
  const hintText = translate('comprehension.press_play');
  const [activeSoundIndex, setActiveSoundIndex] = useState(0);
  const lastClip = activeSoundIndex === audioUrls.length - 1;
  const instance = useSoundPlayer(audioUrls[activeSoundIndex]);
  const { pause, play, getState, reset } = instance;
  const playState = getState();

  useEffect(() => {
    return () => {
      instance.stop();
      instance.reset();
    }
  }, [instance]);

  const [showHint, setShowHint] = useState(false);
  const showHintTimeoutRef = useRef(null);
  useEffect(() => {
    showHintTimeoutRef.current = setTimeout(() => setShowHint(true), 5000);
  }, []);
  useEffect(() => {
    if (playState !== PlayStates.INITIAL) {
      clearTimeout(showHintTimeoutRef.current);
      setShowHint(false);
    }
  }, [playState]);

  const played = checks.hasPlayed(playState, true);
  const isMounted = useMounted();
  const onCompleteAllRef = useRef(onCompleteAll);
  onCompleteAllRef.current = onCompleteAll;
  useEffect(() => {
    if (played) {
      if (lastClip) onCompleteAllRef.current();
      else setActiveSoundIndex((current) => current + 1);
    }
  }, [played, lastClip]);
  useEffect(() => {
    if (isMounted()) play();
  }, [isMounted, activeSoundIndex]);

  const handleNavigateSoundByIndex = useCallback((index) => {
    if (played) reset();
    setActiveSoundIndex((current) => {
      const newIndex = typeof index === 'function' ? index(current) : index;
      // when the active nugget is clicked unpause
      // it won't update the component if the same value is returned
      if (current === newIndex) play();
      return newIndex;
    });
  }, [reset, play, played]);
  const handlePlayButtonClick = useCallback(() => {
    if (checks.isPlaying(playState)) pause();
    else if (lastClip && checks.hasPlayed(playState, true)) handleNavigateSoundByIndex(0);
    else play({ reset: playState !== PlayStates.PAUSED });
  }, [playState, lastClip, handleNavigateSoundByIndex]);
  const handleBackAndForwardNavigate = useCallback(
    (offset) => {
      if (lastClip && played) handleNavigateSoundByIndex((current) => current)
      else handleNavigateSoundByIndex((current) =>
        current + offset === audioUrls.length ? 0 : current + offset
      );
    },
    [audioUrls.length, lastClip, played, handleNavigateSoundByIndex]
  );

  const getUnifiedState = () => {
    if (audioUrls.length === 1) return playState;
    switch (playState) {
      case PlayStates.PAUSED:
        return PlayStates.PAUSED;
      case PlayStates.INITIAL:
        if (activeSoundIndex === 0) return PlayStates.INITIAL;
        else return PlayStates.PLAYING;
      case PlayStates.STOPPED:
      case PlayStates.FAILED:
      case PlayStates.COMPLETED:
        if (lastClip) return PlayStates.COMPLETED;
      // eslint-disable-next-line no-fallthrough
      default: return PlayStates.PLAYING;
    }
  };

  return (
    <Stack gap="1.5rem" alignItems="center">
      <PlayerButtons
        backButtonDisabled={disabled || (activeSoundIndex === 0 && (!lastClip || playState === PlayStates.INITIAL))}
        forwardButtonDisabled={disabled || lastClip}
        onNavigate={handleBackAndForwardNavigate}
        playButton={
          <StyledTooltip text={hintText} visible={showHint}>
            <PlayButton
              data-selector="soundplayer-big-button"
              data-playstate={playState}
              onClick={handlePlayButtonClick}
              disabled={disabled}
              playState={getUnifiedState()}
            />
          </StyledTooltip>
        }
      />
      <NuggetsSoundNavigation
        itemsCount={audioUrls.length}
        onNavigate={handleNavigateSoundByIndex}
        disabled={disabled}
        playing={playState === PlayStates.PLAYING}
        activeItemIndex={
          PlayStates.INITIAL === playState && activeSoundIndex === 0
            ? -1
            : activeSoundIndex
        }
      />
    </Stack>
  );
};

Player.propTypes = {
  audioUrls: PropTypes.arrayOf(PropTypes.string),
  disabled: PropTypes.bool,
  onCompleteAll: PropTypes.func
};

export default Player;
