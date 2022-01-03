import * as sessionSelectors from '../../session/selectors';

export const getLessonContext = (state) => {
  if (sessionSelectors.isReview(state.session)) return 'review';
  if (sessionSelectors.isLesson(state.session)) return 'lesson';

  return null;
};

// speech_recognition:attempt_evaluated
export const speechRecognitionAttemptEvaluatedEventPayload = (data, state) => {
  /* eslint-disable camelcase */
  return {
    locale: data.locale,
    learn_language_alpha3: data.learnLanguageAlpha3,
    lesson_context: getLessonContext(state),
    result: data.result,
    transcript: data.transcript,
    target_text: data.targetText,
    trainer_item_uuid: data.trainerItemUuid,
    confidence_score: data.confidenceScore,
    engine_name: data.engineName
  };
  /* eslint-enable camelcase */
};

export const speechRecognitionAttemptEvaluatedEvent = (data) => (state) => ({
  event: 'speech_recognition:attempt_evaluated',
  version: 1,
  payload: speechRecognitionAttemptEvaluatedEventPayload(data, state)
});
