import * as Engines from '../services/speechRecognition/engines';

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
export const isAnalyzerLibRecognizerSupported = (featureSet = getSpeechFeatureSet()) => {
  return featureSet.every(({ path, type, context }) => {
    const object = getObjectFromPath(path, context);
    return object !== undefined && type === typeof object;
  });
};

const speechEngineSupportedTrainers = {
  [Engines.types.WEB_SPEECH]: ['vocabulary', 'dialog'],
  [Engines.types.NATIVE_SPEECH]: ['vocabulary', 'dialog'],
  [Engines.types.LEGACY_SPEECH]: ['vocabulary']
};

export const trainersContainSpeakInteraction = (trainers, engineName) => {
  const withSpeakInteraction = trainers
    .filter(({ interaction }) => interaction?.toLowerCase() === 'speak');

  if (withSpeakInteraction.length === 0) return false;

  return withSpeakInteraction.some(({ type }) => speechEngineSupportedTrainers[engineName]?.includes(type) === true);
};
