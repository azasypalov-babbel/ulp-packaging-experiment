import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { markupStringToHTML, getFirstCorrectSolution } from '@lessonnine/babbel-markup-helper.js';
import Text from '../../shared/Text';
import { isMicEnabled } from '../../../dux/session/selectors';
import { connect } from 'react-redux';
import { isTask } from '../../shared/itemSelectors';
import { INTERACTION_STATES } from '../shared/scene/useScene';
import SpeakInteractionInput from './SpeakInteractionInput/SpeakInteractionInput';
import InteractionToggleToolbar from '../../shared/SpeechRecognition/InteractionToggleToolbar';
import SpeakInteractionFeedback from './SpeakInteractionFeedback';
import * as sessionActions from '../../../dux/session/actions';
import * as Engines from '../../../services/speechRecognition/engines';
import { compose } from 'redux';
import { withServices } from '../../shared/withServices';
import { last } from 'underscore';
import useFeedbackSounds from '../shared/useFeedbackSounds';

const supportedEngines = [
  Engines.types.NATIVE_SPEECH,
  Engines.types.WEB_SPEECH
];

export const SpeakInteraction = ({
  item,
  active,
  onFinish,
  // eslint-disable-next-line no-unused-vars
  learnLanguageAlpha3,
  // eslint-disable-next-line no-unused-vars
  onAttempt,
  isMicEnabled,
  setMicSettings,
  speechRecognitionService
}) => {
  const [interactionState, setInteractionState] = useState(INTERACTION_STATES.INACTIVE);
  const [attempts, setAttempts] = useState([]);
  const latestAttempt = useMemo(() => last(attempts), [attempts]);
  const [playFeedback] = useFeedbackSounds({
    resetDependencies: [item]
  });

  const isSpeechSupported = supportedEngines
    .includes(speechRecognitionService.getEngineName());

  const handleMicButtonClick = () => {
    setMicSettings(!isMicEnabled);
  };

  useEffect(() => {
    if (active) {
      setInteractionState(INTERACTION_STATES.INPUT);
    } else {
      setInteractionState(INTERACTION_STATES.INACTIVE);
    }
  }, [active]);

  const handleAttempt = useCallback((attempt) => {
    playFeedback(attempt.solved);

    setAttempts((attempts) => {
      const updatedAttempts = [...attempts, attempt];

      // Build tracking attempt in setState to prevent adding `attempts`
      // as a dependency causing the callback to update.
      const trackingAttempt = {
        number: updatedAttempts.length,
        solved: attempt.solved,
        inputText: attempt.inputText,
        text: attempt.text
      };

      onAttempt({ attempt: trackingAttempt });
      return updatedAttempts;
    });
    setInteractionState(INTERACTION_STATES.FEEDBACK);
  }, [onAttempt, setInteractionState, setAttempts, playFeedback]);

  const handleRetry = () => {
    setInteractionState(INTERACTION_STATES.INPUT);
  };

  const handleProceed = () => {
    const mistakeCount = attempts.filter(({ solved }) => !solved).length;
    onFinish(mistakeCount);
  };

  useEffect(() => {
    // Invoking `onFinish` without passing number of mistakes will not consider
    // the item for purge.
    if (active && (!isSpeechSupported || !isMicEnabled)) onFinish();
  }, [active, onFinish, isMicEnabled, isSpeechSupported]);

  const text = isTask(item)
    ? item.displayLanguageText
    : item.learnLanguageText;

  return (
    <>
      {[INTERACTION_STATES.FEEDBACK, INTERACTION_STATES.INPUT].includes(interactionState)
        ? <Text color="spaceGray">...</Text>
        : <Text
          color="spaceGray"
          dangerouslySetInnerHTML={{
            __html: markupStringToHTML(getFirstCorrectSolution(text || ''))
          }}
        />
      }

      {
      /**
       * This is for dev only: his will spawn a button for each interaction.
       * It is also not to spec visually.
       */
        isSpeechSupported && !isMicEnabled && <InteractionToggleToolbar />
      }
      {isSpeechSupported && isMicEnabled && (
        <>
          {interactionState === INTERACTION_STATES.INPUT && <SpeakInteractionInput
            item={item}
            onAttempt={handleAttempt}
            onMicToggleClick={handleMicButtonClick}
          />}

          {interactionState === INTERACTION_STATES.FEEDBACK && <SpeakInteractionFeedback
            item={item}
            latestAttempt={latestAttempt}
            onRetry={handleRetry}
            onProceed={handleProceed}
          />}
        </>
      )}
    </>
  );
};

SpeakInteraction.propTypes = {
  isMicEnabled: PropTypes.bool.isRequired,
  setMicSettings: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  active: PropTypes.bool.isRequired,
  onFinish: PropTypes.func.isRequired,
  onAttempt: PropTypes.func.isRequired,
  learnLanguageAlpha3: PropTypes.string.isRequired,
  speechRecognitionService: PropTypes.object.isRequired
};

const mapStateToProps = ({ session }) => ({
  isMicEnabled: isMicEnabled(session)
});

const mapDispatchToProps = {
  setMicSettings: sessionActions.setMicSettings
};

SpeakInteraction.trainerConfig = {

};

export default compose(
  withServices(['speechRecognitionService']),
  connect(mapStateToProps, mapDispatchToProps)
)(SpeakInteraction);
