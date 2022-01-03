import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { renderInBottomLayout } from '../../../shared/BottomLayout';
import { isInteractionKey } from '../../../../lib/keyboardEvents';
import { compose } from 'redux';
import { connect } from 'react-redux';
import useSpeech, { getSpeakableText, SPEECH_STATES } from '../useSpeech';
import { PERMISSIONS_STATUS } from '../../../../services/permissions/constants';
import useTrainerItemSounds from '../../../Trainer/shared/useTrainerItemSounds';
import SpeakItem from '../../../Trainer/DialogTrainer/SpeakItem';
import InteractionToggle from '../../../shared/SpeechRecognition/InteractionToggle';
import { isWebview } from '../../../../lib/features';
import { StyledSheet, StyledInnerWrapper, StyledBottomWrapper, StyledSpeakItemWrapper } from './styles';
import SpeechMicButton from '../../../shared/MicButton/SpeechMicButton';
import { RESULTS } from '../../../../lib/matchingUtils/evaluate';
import { withServices } from '../../../shared/withServices';
import { STOP_REASON } from '../../../../services/speechRecognition/constants';

// Prevent click events from propagating to the trainer
const stopPropagation = (event) => event.stopPropagation();

export const SpeakInteractionInput = ({
  item,
  onAttempt,
  learnLanguageAlpha3,
  locale,
  onMicToggleClick,
  soundService
}) => {
  const [idleTimerEnabled, setIdleTimerEnabled] = useState(true);
  const [
    speechState,
    { start, stop },
    { micPermission, idle: showTooltip }
  ] = useSpeech({ learnLanguageAlpha3, locale }, { idleTimerEnabled });

  const [playItemSound, isItemSoundPlaying] = useTrainerItemSounds([item]);

  const handleSpeechError = useCallback(() => {}, []);

  const handleMicButtonClick = useCallback(() => {
    if (speechState === SPEECH_STATES.RESTING) {
      start(item)
        .then(onAttempt)
        .catch(handleSpeechError);
    } else {
      stop();
    }
  }, [item, stop, start, speechState, handleSpeechError, onAttempt]);

  const handleMicTouchStart = () => {
    start(item, { pushToSpeak: true })
      .then(onAttempt)
      .catch(handleSpeechError);
  };

  const handleMicTouchEnd = () => {
    stop();
  };

  const handleSpeakItemTouchEnd = (event) => {
    playItemSound(item);
    event.preventDefault();
  };

  const handleSpeakItemClick = () => {
    // When a mouse is used automatically start the speech after playback.
    playItemSound(item)
      .then((ended) => {
        if (ended) {
          // Only start speech recognition if the playback ends fully.
          start(item)
            .then(onAttempt)
            .catch(handleSpeechError);
        }
      });
  };

  // Disable idle timer during sound playback
  useEffect(() => {
    return soundService.subscribe((_, { event }) => {
      setIdleTimerEnabled(event !== 'play');
    });
  }, [soundService]);

  // Stop speech recognition if any sound is triggered in the app
  useEffect(() => {
    return soundService.subscribe((_, { event }) => {
      if (event === 'play') stop(STOP_REASON.CANCEL);
    });
  }, [stop, soundService]);

  // Automatically start speech recognition on web
  useEffect(() => {
    if (isWebview()) return;

    start(item)
      .then(onAttempt)
      .catch(handleSpeechError);
  }, [item, start, onAttempt, handleSpeechError]);

  const handleKeyDown = (event) => {
    if (isInteractionKey(event, ['Shift+Escape'])) {
      event.preventDefault();
      onAttempt({
        solved: true,
        inputText: getSpeakableText(item),
        text: getSpeakableText(item),
        feedbackType: RESULTS.CORRECT
      });
    }
  };

  const appearance =
    micPermission === PERMISSIONS_STATUS.denied ||
    speechState === SPEECH_STATES.ERROR ? 'DISABLED' : speechState;

  return (
    <StyledSheet
      onClick={stopPropagation}
    >
      <StyledInnerWrapper>
        <StyledSpeakItemWrapper>
          <SpeakItem
            state={isItemSoundPlaying(item) ? 'active' : 'default'}
            onTouchEnd={handleSpeakItemTouchEnd}
            onClick={isItemSoundPlaying(item) ? undefined : handleSpeakItemClick}
            text={getSpeakableText(item)} // @todo this can throw an exception
          />
        </StyledSpeakItemWrapper>
        <SpeechMicButton
          appearance={appearance}
          showTooltip={showTooltip}
          visible
          onClick={handleMicButtonClick}
          onTouchStart={handleMicTouchStart}
          onTouchEnd={handleMicTouchEnd}
          data-focus-on-key="Shift+Escape"
          tabIndex={0}
          onKeyDown={handleKeyDown}
        />
        <StyledBottomWrapper>
          <InteractionToggle
            onClick={onMicToggleClick}
          />
        </StyledBottomWrapper>
      </StyledInnerWrapper>
    </StyledSheet>
  );
};

SpeakInteractionInput.propTypes = {
  onMicToggleClick: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  onAttempt: PropTypes.func.isRequired,
  learnLanguageAlpha3: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  soundService: PropTypes.object.isRequired
};

const mapStateToProps = ({ session }) => ({
  learnLanguageAlpha3: session.learnLanguageAlpha3,
  locale: session.locale
});

export default compose(
  connect(mapStateToProps),
  withServices(['soundService']),
  renderInBottomLayout
)(SpeakInteractionInput);
