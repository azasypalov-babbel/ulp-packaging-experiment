import abTesterServiceMock from '../../../../src/demo/mocks/abTesterServiceMock';
import accountServiceMock from '../../../../src/demo/mocks/accountServiceMock';
import contentReleaseServiceMock from '../../../../src/demo/mocks/contentReleaseServiceMock';
import contentServiceMock from '../../../../src/demo/mocks/contentServiceMock';
import demoLessonService from '../../../../src/services/lesson/mock';
import profileServiceMock from '../../../../src/demo/mocks/profileServiceMock';
import reviewServiceMock from '../../../../src/demo/mocks/reviewServiceMock';
import soundService from '../../../../src/services/soundService';
import statisticsServiceMock from '../../../../src/demo/mocks/statisticsServiceMock';
import subscriptionsServiceMock from '../../../../src/demo/mocks/subscriptionsServiceMock';
import surveyServiceMock from '../../../../src/demo/mocks/surveyServiceMock';
import trackingServiceMock from '../../../../src/demo/mocks/trackingServiceMock';

/**
 * replica of ../../../../src/services/helper.js - mockedServices
 */
export const mockedServices = {
  abTesterService: abTesterServiceMock,
  accountService: accountServiceMock,
  contentReleaseService: contentReleaseServiceMock,
  contentService: contentServiceMock,
  lessonService: demoLessonService,
  profileService: profileServiceMock,
  reviewService: reviewServiceMock,
  soundService: soundService,
  statisticsService: statisticsServiceMock,
  subscriptionsService: subscriptionsServiceMock,
  surveyService: surveyServiceMock,
  trackingService: trackingServiceMock
};
