import camelize from 'camelize';
import { log } from '../../lib/logging';

const fetchSubstitutions = () => {
  return import(/* webpackChunkName: "demo" */ '../data/speech-recognition-substitutions-en-deu')
    .then((module) => {
      const response = camelize(module.default.speech_recognition_substitutions);
      log('speechRecognitionSubstitutionsServiceMock#fetchSubstitutions', response);
      return response;
    });
};

export default {
  fetchSubstitutions
};
