import camelize from 'camelize';
import { CAT_PREVIEW_LESSON_DATA, getDataFromCat } from '../../catServicesHelper';

const fetchSubstitutions = () => {
  return getDataFromCat(CAT_PREVIEW_LESSON_DATA, 'catSpeechRecognitionSubstitutionsService: fetchSubstitutions')
    .then(({ substitutions }) => camelize(substitutions.speech_recognition_substitutions));
};

export default {
  fetchSubstitutions
};

