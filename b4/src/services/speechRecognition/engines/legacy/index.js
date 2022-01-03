import { ENGINE_NAME } from './constants';

const notImplemented = (name) => () => { throw new Error(`legacySpeechRecognitionService.${name} not implemented`); };

const getEngineName = () => ENGINE_NAME;

const getOfflineAudioContext = () => {
  return new window.OfflineAudioContext(1, 444100, 44100);
};

const getWindow = () => {
  return window;
};

// feature set needed for speech reco. trainers
const getSpeechFeatureSet = () => {
  return [
    { path: 'navigator.mediaDevices.getUserMedia', type: 'function', context: getWindow },
    { path: 'AudioContext', type: 'function', context: getWindow },
    { path: 'OfflineAudioContext', type: 'function', context: getWindow },
    { path: 'createBufferSource', type: 'function', context: getOfflineAudioContext },
    { path: 'decodeAudioData', type: 'function', context: getOfflineAudioContext }
  ];
};

const getObjectFromPath = (pathString, context) => {
  const path = pathString.split('.');
  const object = context();

  return path.reduce((acc, val) => {
    return (acc !== undefined && val in acc) ? acc[val] : undefined;
  }, object);
};

// check the featureset is present in the given context
export const isSupported = () => {
  return getSpeechFeatureSet().every(({ path, type, context }) => {
    const object = getObjectFromPath(path, context);
    return object !== undefined && type === typeof object;
  });
};

export default {
  start: notImplemented('start'),
  stop: notImplemented('stop'),
  cleanup: notImplemented('cleanup'),
  isSupported,
  getEngineName
};
