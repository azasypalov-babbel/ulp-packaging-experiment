import mediaUrlService from '../../src/services/mediaUrlService';
import recordingService from '../../src/services/recordingService';
import soundService from '../../src/services/soundService';
import trackingService from '../../src/services/trackingService';
import translationService from '../../src/services/translationService';
import navigationService from '../../src/services/navigationService';

import contentReleaseServiceMock from '../../src/demo/mocks/contentReleaseServiceMock';
import statisticsServiceMock from '../../src/demo/mocks/statisticsServiceMock';
import surveyServiceMock from '../../src/demo/mocks/surveyServiceMock';

import nativeAbTesterService from '../../src/services/nativeAbTesterService';
import nativeAccountService from '../../src/services/nativeAccountService';
import nativeContentService from '../../src/services/nativeContentService';
import nativeHintButton from '../../src/services/nativeHintButton';
import nativeLessonService from '../../src/services/lesson/native';
import nativePermissionsService from '../../src/services/permissions/service.webview';
import nativeReviewService from '../../src/services/nativeReviewService';
import nativeSettingsService from '../../src/services/nativeSettingsService';
import speechRecognitionService from '../../src/services/speechRecognition/service';
import nativeProfileService from '../../src/services/nativeProfileService';
import nativeSubscriptionsService from '../../src/services/nativeSubscriptionsService';
import { createFocusService } from '../../src/services/focusService';

import services from '../../src/services/index.webview';

describe(`webview platform services`, () => {
  describe(`by default`, () => {
    test(`returns native services`, () => {
      const focusService = createFocusService();
      focusService.returnFocus = expect.any(Function);
      expect(services).toEqual({
        focusService,
        profileService: nativeProfileService,
        subscriptionsService: nativeSubscriptionsService,
        navigationService: navigationService,
        accountService: nativeAccountService,
        contentService: nativeContentService,
        contentReleaseService: contentReleaseServiceMock,
        lessonService: nativeLessonService,
        abTesterService: nativeAbTesterService,
        soundService: soundService,
        nativeHintButton: nativeHintButton,
        surveyService: surveyServiceMock,
        trackingService: trackingService,
        mediaUrlService: mediaUrlService,
        translationService: translationService,
        speechRecognitionService,
        recordingService: recordingService,
        statisticsService: statisticsServiceMock,
        permissionsService: nativePermissionsService,
        reviewService: nativeReviewService,
        settingsService: nativeSettingsService
      });
    });
  });
});
