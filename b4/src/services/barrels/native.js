/**
 * native (bridged) service implementations
 */
import nativeAbTesterService from '../nativeAbTesterService';
import nativeLessonService from '../lesson/native';
import nativeContentService from '../nativeContentService';
import nativeAccountService from '../nativeAccountService';
import nativeReviewService from '../nativeReviewService';
import nativeSettingsService from '../nativeSettingsService';
import nativeHintButton from '../nativeHintButton';
import nativeProfileService from '../nativeProfileService';
import nativeSubscriptionsService from '../nativeSubscriptionsService';
import nativePermissionsService from '../permissions/service.webview';
import speechRecognitionService from '../speechRecognition/service';
import nativeTrackingService from '../nativeTrackingService';
import trackingService from '../trackingService';

import mockedServices from './mock';
import { isAndroid } from '../../lib/features';

export default {
  ...mockedServices,
  nativeHintButton,
  trackingService: isAndroid()
    ? nativeTrackingService // Android captrues tracking events sent over the bridge
    : trackingService,      // iOS uses network intercepts to capture tracking events
  profileService: nativeProfileService,
  subscriptionsService: nativeSubscriptionsService,
  abTesterService: nativeAbTesterService,
  lessonService: nativeLessonService,
  contentService: nativeContentService,
  accountService: nativeAccountService,
  reviewService: nativeReviewService,
  speechRecognitionService,
  settingsService: nativeSettingsService,
  permissionsService: nativePermissionsService
};
