/**
 * common service implementations
 */

import mediaUrlService from '../mediaUrlService';
import permissionsService from '../permissions/service';
import recordingService from '../recordingService';
import soundService from '../soundService';
import settingsService from '../settingsService';
import translationService from '../translationService';
import speechRecognitionService from '../speechRecognition/service';
import navigationService from '../navigationService';
import { createFocusService } from '../focusService';

export default {
  focusService: createFocusService(),
  navigationService,
  mediaUrlService,
  permissionsService,
  recordingService,
  soundService,
  settingsService,
  speechRecognitionService,
  translationService
};
