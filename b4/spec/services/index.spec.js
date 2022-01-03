import abTesterService from '../../src/services/abTesterService';
import accountService from '../../src/services/accountService';
import contentReleaseService from '../../src/services/contentReleaseService';
import contentService from '../../src/services/contentService';
import lessonService from '../../src/services/lesson/default';
import mediaUrlService from '../../src/services/mediaUrlService';
import permissionsService from '../../src/services/permissions/service';
import recordingService from '../../src/services/recordingService';
import reviewService from '../../src/services/reviewService';
import soundService from '../../src/services/soundService';
import speechRecognitionService from '../../src/services/speechRecognition/service';
import statisticsService from '../../src/services/statisticsService';
import surveyService from '../../src/services/surveyService';
import trackingService from '../../src/services/trackingService';
import translationService from '../../src/services/translationService';
import navigationService from '../../src/services/navigationService';
import profileService from '../../src/services/profileService';
import subscriptionsService from '../../src/services/subscriptionsService';
import settingsService from '../../src/services/settingsService';
import { createFocusService } from '../../src/services/focusService';

import services from '../../src/services';

describe(`web platform services`, () => {
  describe(`by default`, () => {
    test(`returns default services`, () => {
      const focusService = createFocusService();
      focusService.returnFocus = expect.any(Function);
      expect(services).toEqual({
        focusService,
        navigationService,
        accountService,
        contentService,
        contentReleaseService,
        reviewService,
        lessonService,
        abTesterService,
        soundService,
        surveyService,
        trackingService,
        mediaUrlService,
        translationService,
        speechRecognitionService,
        recordingService,
        statisticsService,
        permissionsService,
        profileService,
        subscriptionsService,
        settingsService
      });
    });
  });
});
