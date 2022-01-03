import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createSentenceParts, hasGap, removeGapFormatting } from '@lessonnine/babbel-markup-helper.js';
import { learnLanguageAlpha3toBCP47 } from '../../../lib/languageCodeConverter';
import { ServiceContext } from '../../shared/withServices';
import { isTask } from '../../shared/itemSelectors';
import { useDispatch, useSelector } from 'react-redux';
import { get, isWebview } from '../../../lib/features';
import { PERMISSIONS_STATUS } from '../../../services/permissions/constants';
import { requestMicPermissions } from '../../../dux/permissions/actions';
import { addMessage, removeMessage } from '../../../dux/messages/actions';
import { MESSAGE_KEYS } from '../../../dux/messages/messageKeys';
import { STOP_REASON } from '../../../services/speechRecognition/constants';
import { RESULTS } from '../../../lib/matchingUtils/evaluate';
import { useMounted } from '../../shared/hooks/useMounted';

// Constants
export const SPEECH_STATES = {
  ERROR: 'ERROR',
  LISTENING: 'LISTENING',
  RECORDING: 'RECORDING',
  RESTING: 'RESTING'
};

export const SPEECHRECOGNITION_ERRORS = {
  NO_SPEECH: 'no-speech',
  ABORTED: 'aborted',
  AUDIO_CAPTURE: 'audio-capture',
  NETWORK: 'network',
  NOT_ALLOWED: 'not-allowed',
  SERVICE_NOT_ALLOWED: 'service-not-allowed',
  BAD_GRAMMAR: 'bad-grammar',
  LANGUAGE_NOT_SUPPORTED: 'language-not-supported'
};

export const CUSTOM_ERRORS = {
  UNKNOWN_ERROR: 'unknown-error',
  MIC_MUTED: 'mic-muted'
};

export const MEDIADEVICES_ERRORS = {
  NOT_ALLOWED: 'NotAllowedError'
};

const SPEECH_WORD_TIMEOUT = 1000;
export const IDLE_TIMEOUT = get('is_web_speech_mock') ? 1500 : 5000;
const CANCEL_TIMEOUT = IDLE_TIMEOUT;

// Item parsing
const firstGap = (text) => createSentenceParts(text)
  .filter(hasGap)
  .map(removeGapFormatting)[0];

export const getSpeakableText = (item) => {
  if (isTask(item)) {
    throw new Error('Task items are not supported for speak interaction');
  }

  const text = item.learnLanguageText;

  if (hasGap(text)) {
    return firstGap(text);
  }
  return text;
};

const getTargetSound = (item) => {
  let soundId = item?.sound?.id;
  if (!soundId) {
    throw new Error('Item must have a sound provided for speak interaction');
  }
  return soundId;
};

// Error to message mapping
const recognitionGenericError = (error) => [
  CUSTOM_ERRORS.UNKNOWN_ERROR,
  SPEECHRECOGNITION_ERRORS.SERVICE_NOT_ALLOWED,
  SPEECHRECOGNITION_ERRORS.NETWORK,
  SPEECHRECOGNITION_ERRORS.AUDIO_CAPTURE,
  SPEECHRECOGNITION_ERRORS.LANGUAGE_NOT_SUPPORTED,
  SPEECHRECOGNITION_ERRORS.BAD_GRAMMAR
].includes(error);

export const getMessageKey = (error) => {
  const isNotAllowedError = [
    MEDIADEVICES_ERRORS.NOT_ALLOWED,
    SPEECHRECOGNITION_ERRORS.NOT_ALLOWED
  ].includes(error);
  const isMicMutedError = error === CUSTOM_ERRORS.MIC_MUTED;
  const isGenericError = recognitionGenericError(error);

  let errorKey = null;
  if (isGenericError) {
    errorKey = MESSAGE_KEYS.MIC_GENERIC;
  } else if (isMicMutedError) {
    errorKey = MESSAGE_KEYS.MIC_MUTED;
  } else if (isNotAllowedError) {
    errorKey = MESSAGE_KEYS.MIC_PERMISSIONS;
  }

  return errorKey;
};

// Async wrapper for speech start
const startSpeechFactory = (speechRecognitionService, { learnLanguageAlpha3, locale }) => (
  item, { onIntermediateResult, onStart, onSpeechStart, onUnmute }) =>
  new Promise((resolve, reject) => {
    try {
      const targetText = getSpeakableText(item);
      const targetSound = getTargetSound(item);

      const handleResult = (result) => {
        if (result.isFinal) {
          const attempt = {
            inputText: result.transcript,
            text: targetText,
            solved: result.solved,
            feedbackType: result.solved
              ? RESULTS.CORRECT
              : RESULTS.INCORRECT
          };
          resolve(attempt);
        } else {
          onIntermediateResult(result);
        }
      };
      const handleMutedChange = ({ target }) => {
        if (target.muted) {
          reject(CUSTOM_ERRORS.MIC_MUTED);
        } else {
          onUnmute();
        }
      };

      speechRecognitionService.start({
        onStart,
        onSpeechStart,
        onEnd: () => reject(SPEECHRECOGNITION_ERRORS.ABORTED),
        onError: ({ error }) => reject(error),
        onResult: handleResult,
        onMuteChange: handleMutedChange,
        lang: learnLanguageAlpha3toBCP47(learnLanguageAlpha3),
        learnLanguageAlpha3,
        interimResults: true,
        continuous: true,
        targetText,
        soundId: targetSound,
        itemUuid: item.id,
        locale: locale
      });
    } catch (error) {
      reject(error);
    }
  });

// Main hook
const useSpeech = ({ learnLanguageAlpha3, locale }, options = { idleTimerEnabled: true }) => {
  const { speechRecognitionService, soundService } = useContext(ServiceContext);
  const micPermission = useSelector((state) => state.permissions.micPermission);
  const dispatch = useDispatch();

  const startSpeech = useMemo(() =>
    startSpeechFactory(speechRecognitionService, { learnLanguageAlpha3, locale }),
  [speechRecognitionService, learnLanguageAlpha3, locale]);

  // Internal state
  const [state, setState] = useState(SPEECH_STATES.RESTING);
  const [idle, setIdle] = useState(false);
  const [intermediateResultCount, setIntermediateResultCount] = useState(0);
  const pushToSpeak = useRef(isWebview());

  // Mounting and unmounting
  useEffect(() => {
    // Request mic permissions from the user when the interaction mounts
    dispatch(requestMicPermissions());
    return () => {
      // Clean up speech recognition instance on unmount
      speechRecognitionService.cleanup();
    };
  }, [speechRecognitionService, dispatch]);

  useEffect(() => {
    if (micPermission !== PERMISSIONS_STATUS.granted) {
      // Immediately stop speech recognition if permissions ever become denied
      speechRecognitionService.stop(STOP_REASON.CANCEL);
    }
  }, [micPermission, speechRecognitionService]);

  // If a user stays in a non-error state for a certain time,
  // the user is considered being `idle`.
  // If the user has their finger on the speak button, they should
  // not be considered idle because they are, in fact, interacting with the app
  useEffect(() => {
    setIdle(false);

    const listeningOrRecording = pushToSpeak.current &&
       [SPEECH_STATES.LISTENING, SPEECH_STATES.RECORDING].includes(state);

    const goIntoIdleState = options.idleTimerEnabled &&
      state !== SPEECH_STATES.ERROR && !listeningOrRecording;

    if (goIntoIdleState) {
      const id = setTimeout(setIdle, IDLE_TIMEOUT, true);
      return () => clearTimeout(id);
    }
  }, [state, options.idleTimerEnabled, intermediateResultCount]);

  // Automatically stop speech
  useEffect(() => {
    // In pushToTalk mode speech should never be automatically stopped
    if (pushToSpeak.current) return;
    const waitingForSound = state === SPEECH_STATES.LISTENING;
    const isSoundDetected = state === SPEECH_STATES.RECORDING && intermediateResultCount === 0;
    const isSpeechDetected = state === SPEECH_STATES.RECORDING && intermediateResultCount > 0;

    if (waitingForSound || isSoundDetected) {
      const delay = IDLE_TIMEOUT + CANCEL_TIMEOUT;
      // Cancel speech recognition after prolonged timeout of no speech input.
      const id = setTimeout(speechRecognitionService.stop, delay, STOP_REASON.CANCEL);
      return () => clearTimeout(id);
    } else if (isSpeechDetected) {
      const delay = SPEECH_WORD_TIMEOUT;
      // Force finish speech recognition with attempt when no new speech input is detected.
      const id = setTimeout(speechRecognitionService.stop, delay, STOP_REASON.FINISH);
      return () => clearTimeout(id);
    }
  }, [state, pushToSpeak, intermediateResultCount, speechRecognitionService]);

  const stop = useCallback((reason) => {
    speechRecognitionService.stop(reason);
  }, [speechRecognitionService]);

  const getMounted = useMounted();
  const start = useCallback((item, options = { pushToSpeak: false }) => {
    pushToSpeak.current = options.pushToSpeak;
    setIntermediateResultCount(0);

    const handleStart = () => {
      setState(SPEECH_STATES.LISTENING);
    };
    const handleSpeechStart = () => {
      setState(SPEECH_STATES.RECORDING);
    };
    const handleIntermediateResult = (attempt) => {
      if (attempt.transcript.length > 0) {
        setIntermediateResultCount((count) => count + 1);
      }
    };
    const handleUnmute = () => {
      setState((state) => state === SPEECH_STATES.ERROR
        ? SPEECH_STATES.RESTING
        : state
      );
      dispatch(removeMessage(MESSAGE_KEYS.MIC_MUTED));
    };

    // Ensure all sounds are stopped before starting speech recognition
    soundService.stop();

    return startSpeech(
      item,
      {
        onIntermediateResult: handleIntermediateResult,
        onStart: handleStart,
        onSpeechStart: handleSpeechStart,
        onUnmute: handleUnmute
      })
      .catch((error) => {
        if (getMounted()) {
          // Handle speech UI states for errors
          if ([
            SPEECHRECOGNITION_ERRORS.NO_SPEECH,
            SPEECHRECOGNITION_ERRORS.ABORTED,
            SPEECHRECOGNITION_ERRORS.NOT_ALLOWED,
            MEDIADEVICES_ERRORS.NOT_ALLOWED
          ].includes(error)) {
            // Non critical errors return to resting state
            setState(SPEECH_STATES.RESTING);
          } else {
            // Critical errors produce errors state
            setState(SPEECH_STATES.ERROR);
          }
        }
        // Stop speech recognition in case of mic muted error
        if (error === CUSTOM_ERRORS.MIC_MUTED) {
          stop();
        }
        // Handle full-page messages
        const message = getMessageKey(error);
        if (message) {
          dispatch(addMessage(message));
        }

        // Re throw error so the consumer can react to failures
        if (error instanceof Error) {
          throw error;
        } else {
          throw new Error(error);
        }
      });
  }, [startSpeech, dispatch, stop, soundService]);

  const actions = { start, stop };
  const context = { micPermission, idle };

  return [state, actions, context];
};

export default useSpeech;
