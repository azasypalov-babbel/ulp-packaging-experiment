import soundService from '../../../../src/services/soundService';
import mediaUrlService from '../../../../src/services/mediaUrlService';
import translationService from '../../../../src/services/translationService';
import recordingService from '../../../../src/services/recordingService';
import permissionsService from '../../../../src/services/permissions/service';
import navigationService from '../../../../src/services/navigationService';
import settingsService from '../../../../src/services/settingsService';
import { createFocusService } from '../../../../src/services/focusService';

import speechRecognitionService from '../../../../src/services/speechRecognition/service';

/**
 * replica of ../../../../src/services/helper.js - commonServices
 */
export const commonServices = {
  focusService: (() => {
    const focusService = createFocusService();
    focusService.returnFocus = expect.any(Function);
    return focusService;
  })(),
  navigationService,
  soundService,
  mediaUrlService,
  translationService,
  recordingService,
  speechRecognitionService,
  permissionsService,
  settingsService
};
