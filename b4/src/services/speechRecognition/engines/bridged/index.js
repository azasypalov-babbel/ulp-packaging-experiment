import { NativeBridge, isBridgeWorking, noOp } from '../../../../lib/nativeBridge';
import { log } from '../../../../lib/logging';
import store from '../../../../store';
import { getLessonContext } from '../../../../dux/tracker/events/speechRecognition';
import { ENGINE_NAME } from './constants';

const BRIDGE_NAME = 'speech';
const BRIDGE_METHODS = {
  START: 'START',
  STOP: 'STOP'
};
export const BRIDGE_EVENTS = {
  ON_START: 'onStart',
  ON_SPEECH_START: 'onSpeechStart',
  ON_RESULT: 'onResult',
  ON_ERROR: 'onError',
  ON_END: 'onEnd'
};
export class NativeSpeechRecognitionService extends NativeBridge {
  constructor() {
    super(
      BRIDGE_NAME,
      BRIDGE_EVENTS,
      BRIDGE_METHODS
    );
  }

  handleStart() {
    this.onStart();
  }

  handleSpeechStart() {
    this.onSpeechStart();
  }

  handleResult(event) {
    /* the payload that we need for this.onResult() is hidden in
     * event.detail.payload
     */
    if (this.onResult) {
      log('nativeSpeechRecognitionService: calling this.onResult with payload: ',
        event.detail.isFinal, event.detail.confidenceScore, event.detail.transcript, event.detail.solved);
      let payload = {
        isFinal: event.detail.isFinal,
        confidenceScore: event.detail.confidenceScore,
        transcript: event.detail.transcript,
        solved: event.detail.solved
      };
      this.onResult(payload);
    }
  }

  handleError() {
    this.onError();
  }

  handleEnd() {
    this.onEnd();
  }

  start({ targetText, soundId, itemUuid, onStart, onSpeechStart, onResult, onError, onEnd }) {
    log('nativeSpeechRecognitionService#start', targetText, soundId);

    this.onStart = onStart || noOp;
    this.onSpeechStart = onSpeechStart || noOp;
    this.onResult = onResult;
    this.onError = onError || noOp;
    this.onEnd = onEnd || noOp;

    this.addEventListener(BRIDGE_EVENTS.ON_START, this.handleStart);
    this.addEventListener(BRIDGE_EVENTS.ON_SPEECH_START, this.handleSpeechStart);
    this.addEventListener(BRIDGE_EVENTS.ON_RESULT, this.handleResult);
    this.addEventListener(BRIDGE_EVENTS.ON_ERROR, this.handleError);
    this.addEventListener(BRIDGE_EVENTS.ON_END, this.handleEnd);

    const lessonContext = getLessonContext(store.getState());

    this.postMessage(BRIDGE_METHODS.START, { targetText, soundId, itemUuid, lessonContext });
  }

  stop() {
    log('nativeSpeechRecognitionService#stop');
    this.postMessage(BRIDGE_METHODS.STOP);
  }

  cleanup() {
    log('nativeSpeechRecognitionService#cleanup');
    this.removeEventListener(BRIDGE_EVENTS.ON_START, this.handleStart);
    this.removeEventListener(BRIDGE_EVENTS.ON_SPEECH_START, this.handleSpeechStart);
    this.removeEventListener(BRIDGE_EVENTS.ON_RESULT, this.handleResult);
    this.removeEventListener(BRIDGE_EVENTS.ON_ERROR, this.handleError);
    this.removeEventListener(BRIDGE_EVENTS.ON_END, this.handleEnd);
  }

  getEngineName() {
    return ENGINE_NAME;
  }

  isSupported() {
    return isBridgeWorking();
  }
}

export default new NativeSpeechRecognitionService();
