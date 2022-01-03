import nativeAbTesterService from '../../../../src/services/nativeAbTesterService';
import nativeLessonService from '../../../../src/services/lesson/native';
import nativeContentService from '../../../../src/services/nativeContentService';
import nativeAccountService from '../../../../src/services/nativeAccountService';
import nativeReviewService from '../../../../src/services/nativeReviewService';
import nativeSettingsService from '../../../../src/services/nativeSettingsService';
import speechRecognitionService from '../../../../src/services/speechRecognition/service';
import nativeHintButton from '../../../../src/services/nativeHintButton';
import nativePermissionsService from '../../../../src/services/permissions/service.webview';
import trackingService from '../../../../src/services/trackingService';
import nativeProfileService from '../../../../src/services/nativeProfileService';
import nativeSubscriptionsService from '../../../../src/services/nativeSubscriptionsService';
import { mockedServices } from './mock';

/**
 * replica of ../../../../src/services/helper.js - nativeServices
 */
export const nativeServices = {
  ...mockedServices,
  nativeHintButton,
  trackingService,
  profileService: nativeProfileService,
  subscriptionsService: nativeSubscriptionsService,
  abTesterService: nativeAbTesterService,
  lessonService: nativeLessonService,
  contentService: nativeContentService,
  accountService: nativeAccountService,
  reviewService: nativeReviewService,
  settingsService: nativeSettingsService,
  permissionsService: nativePermissionsService,
  speechRecognitionService
};
