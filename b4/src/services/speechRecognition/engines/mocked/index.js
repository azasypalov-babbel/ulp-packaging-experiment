import { get as isFeatureEnabled } from '../../../../lib/features';
import { ENGINE_NAME } from './constants';

const noOp = () => { };

let mockRecognitionInstance;

const mockRecognition = {
  timers: [],
  onStart: noOp,
  onSpeechStart: noOp,
  onError: noOp,
  onResult: noOp,
  onEnd: noOp
};

const timeout = (fn, time) => {
  mockRecognition.timers.push(setTimeout(fn, time));
};

const start = (options = {}) => {
  mockRecognitionInstance = {
    ...mockRecognition,
    ...options
  };
  timeout(mockRecognitionInstance.onStart, 100);
  timeout(mockRecognitionInstance.onSpeechStart, 2500 * 1);
  timeout(() => {
    mockRecognitionInstance.onResult({
      isFinal: true,
      confidenceScore: Math.round(Math.random() * 100) / 100,
      transcript: 'Ich bin eine Cowboy'
    });
    mockRecognitionInstance.onEnd();
  }, 2500 * 2);
};

const stop = () => {
  if (!mockRecognitionInstance) return;

  mockRecognitionInstance.onEnd();
  mockRecognitionInstance.timers.forEach(clearTimeout);
  mockRecognitionInstance.timers = [];
};

const cleanup = () => {
  stop();
  mockRecognitionInstance = mockRecognition;
};

const isSupported = () => isFeatureEnabled('is_web_speech_mock');
const getEngineName = () => ENGINE_NAME;

export default {
  start,
  stop,
  cleanup,
  isSupported,
  getEngineName
};
