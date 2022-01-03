import { STOP_REASON } from './constants';
import serviceDetection from './serviceDetection';

const supportedEngine = serviceDetection();

export class SpeechRecognitionService {
  constructor(engine) {
    this.engine = engine;
  }

  getEngineName() {
    return this.engine?.getEngineName();
  }

  isSupported() {
    return this.engine?.isSupported();
  }

  start(options) {
    this.engine?.start(options);
  }

  stop(reason = STOP_REASON.FINISH) {
    this.engine?.stop(reason);
  }

  cleanup() {
    this.engine?.cleanup();
  }
}

export default new SpeechRecognitionService(supportedEngine);
