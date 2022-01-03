import { speechRecognitionAttemptEvaluatedEvent } from '../../../../src/dux/tracker/events/speechRecognition';

const initialState = {
  session: {
    type: 'REVIEW_SEARCH'
  }
};

const speechRecognitionData = {
  result: 'unsolved',
  transcript: 'rechercher un hôtel à Aubervilliers',
  targetText: 'Dieser Mann hätte gerne Muskeln',
  trainerItemUuid: '3b03615626e3fa1065e39cf3b954c3f5',
  confidenceScore: 100,
  engineName: 'WebAPISpeechRecognition',
  learnLanguageAlpha3: 'DEU',
  locale: 'en'
};

describe('speech_recognition events', () => {
  describe('speech_recognition:attempt_evaluated', () => {
    test('matches snapshot', () => {
      expect(
        speechRecognitionAttemptEvaluatedEvent(speechRecognitionData)(initialState)
      ).toMatchSnapshot();
    });
  });
});
