import { createServicesOverride } from './factory';
import mockedSpeechRecognitionService from '../speechRecognition/engines/mocked';
import nativeSpeechRecognitionService from '../speechRecognition/engines/bridged';
import legacySpeechRecognitionService from '../speechRecognition/engines/legacy';
import mockPermissionsService from '../permissions/service.mock';

/** overrides for speech recognition depending on feature flags */
export default [
  createServicesOverride(
    {
      speechRecognitionService: mockedSpeechRecognitionService,
      permissionsService: mockPermissionsService
    },
    'is_web_speech_mock'
  ),
  createServicesOverride(
    {
      speechRecognitionService: nativeSpeechRecognitionService
    },
    'is_native_speech'
  ),
  createServicesOverride(
    {
      speechRecognitionService: legacySpeechRecognitionService
    },
    'is_analyzer_lib_recognizer'
  )
];
