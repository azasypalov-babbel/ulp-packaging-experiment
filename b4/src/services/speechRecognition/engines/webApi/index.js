import speechRecognitionSubstitutionsService from '../../substitutions';
import { startMuteDetection } from '../../muteDetection';
import speechInputAssessment from '../../../../lib/speech/inputAssessment';
import { memoize } from 'underscore';
import { STOP_REASON } from '../../constants';
import { isChrome } from '../../../../lib/browserDetection';
import { speechRecognitionAttemptEvaluatedEvent } from '../../../../dux/tracker/events/speechRecognition';
import store from '../../../../store';
import { track } from '../../../../dux/tracker/actions';
import { ENGINE_NAME } from './constants';

const handleSpeechEvaluated = (result, context) => {
  if (result.isFinal) {
    const eventData = {
      result: result.solved ? 'solved' : 'unsolved',
      transcript: result.transcript,
      confidenceScore: parseInt(result.confidenceScore * 100, 10),
      targetText: context.targetText,
      trainerItemUuid: context.itemUuid,
      learnLanguageAlpha3: context.learnLanguageAlpha3,
      locale: context.locale,
      engineName: ENGINE_NAME
    };
    store.dispatch(track(speechRecognitionAttemptEvaluatedEvent(eventData)));
  }
};


const noOp = () => { };

let recognition;

const getSpeechRecognition = () => window.SpeechRecognition || window.webkitSpeechRecognition;

const stop = (reason = STOP_REASON.FINISH) => {
  if (!recognition) return;
  if (reason === STOP_REASON.CANCEL) {
    // Stopping with CANCEL reason will not submit results
    recognition.onresult = noOp;
  }
  // Stopping with FINISH reason, results may be submitted before ending
  recognition.stop();
};

const substitutions = memoize(({ locale, learnLanguageAlpha3 }) => {
  return speechRecognitionSubstitutionsService
    .fetchSubstitutions({ locale, learnLanguageAlpha3 })
    // Do not memoize a failed promise
    .catch(() => delete substitutions.cache[`${locale}:${learnLanguageAlpha3}`]);
}, ({ locale, learnLanguageAlpha3 }) => `${locale}:${learnLanguageAlpha3}`);

const start = (options = {}) => {
  const SpeechRecognition = getSpeechRecognition();

  recognition = new SpeechRecognition();

  recognition.maxAlternatives = options.maxAlternatives || 5;
  recognition.interimResults = options.interimResults || false;
  recognition.lang = options.lang || 'en-US';
  recognition.continuous = options.continuous || false;

  recognition.onstart = () => {
    if (options.onStart) options.onStart();
    return startMuteDetection({ onChange: options.onMuteChange || noOp })
      .then((cleanupMuteDetection) => {
        if (!recognition) {
          cleanupMuteDetection();
          return;
        }

        if (recognition.cleanupMuteDetection) {
          recognition.cleanupMuteDetection();
        }

        recognition.cleanupMuteDetection = cleanupMuteDetection;
      }).catch((error) => {
        recognition?.stop();
        if (options.onError) options.onError(error);
      });
  };

  recognition.onspeechstart = options.onSpeechStart || noOp;
  recognition.onresult = (event) => {
    const resultsList = Array.from(event.results);
    const lastResult = resultsList[resultsList.length - 1];

    if (options.onResult) {
      substitutions({
        locale: options.locale,
        learnLanguageAlpha3: options.learnLanguageAlpha3
      })
        .catch(() => ({ lookupTableEntries: [], characterSubstitutionCosts: [] }))
        .then(({ lookupTableEntries, characterSubstitutionCosts }) =>
          speechInputAssessment.createAssessmentForSpeechRecognitionResults(
            options.targetText,
            resultsList,
            { lookupTableEntries, characterSubstitutionCosts }
          )
        )
        .then(({ confidenceScore, solved, transcript }) => {
          const result = {
            isFinal: lastResult.isFinal,
            confidenceScore,
            solved,
            transcript
          };
          const context = {
            targetText: options.targetText,
            learnLanguageAlpha3: options.learnLanguageAlpha3,
            locale: options.locale,
            itemUuid: options.itemUuid
          };
          handleSpeechEvaluated(result, context);
          options.onResult(result);
        });
    }
  };
  recognition.onerror = options.onError || noOp;
  recognition.onend = () => {
    if (options.onEnd) options.onEnd();
  };

  recognition.start();

  return recognition;
};

const cleanup = () => {
  if (!recognition) return;

  if (recognition.cleanupMuteDetection) {
    recognition.cleanupMuteDetection();
  }

  recognition.onend = noOp;
  recognition.onresult = noOp;

  recognition.stop();
  recognition = null;
};

const getEngineName = () => ENGINE_NAME;

const isSupported = () => {
  const SpeechRecognition = getSpeechRecognition();
  return Boolean(SpeechRecognition) && isChrome;
};

export default {
  start,
  stop,
  cleanup,
  isSupported,
  getEngineName
};
