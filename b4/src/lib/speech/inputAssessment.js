import TranscribedInputAssessment from '@lessonnine/linguistic-assessment.js/dist/transcribed';

const ALLOWED_ERRORS = 1;
const THRESHOLD = 0.2;

/**
 * general module for any kind of speech recognition processing,
 * such as matching, assessment, etc
 */
export default new TranscribedInputAssessment({
  allowedErrors: ALLOWED_ERRORS,
  threshold: THRESHOLD
});
