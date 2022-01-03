import mockStore from '../mockStore';
import * as types from '../../../src/dux/survey/types';
import { loadSurvey } from '../../../src/dux/survey/actions';
import surveyService from '../../../src/services/surveyService';
import cookies from '../../../src/lib/cookies';

jest.mock('../../../src/services/awsApiClient');
jest.mock('../../../src/services/surveyService');
jest.mock('../../../src/services/trackingService');
jest.mock('../../../src/lib/cookies', () => ({
  setCookie: jest.fn()
}));

describe('Survey Actions', () => {
  const locale = 'en';
  const learnLanguageAlpha3 = 'FRA';
  const unlocked = true;
  const lessonUuid = 'a16c1627c056335525706ed1ee54bf0ab4c452b9';
  const uuid = 'ebc5ec8cec0b0d2f2a2365e793a4cdf3352d45cc';
  const createdAt = '2020-01-05';

  const state = {
    session: {
      locale,
      learnLanguageAlpha3
    },
    content: {
      data: {
        unlocked
      }
    },
    lesson: {
      lessonUuid
    },
    account: {
      data: {
        uuid,
        createdAt
      }
    }
  };

  surveyService.loadSurvey.mockImplementation(() => {});

  const store = mockStore(state);

  afterEach(() => {
    surveyService.loadSurvey.mockClear();
    store.clearActions();
  });

  describe('loadSurvey', () => {
    test('loads the survey', () => {
      const expectedActions = [
        {
          type: `${types.LOAD_SURVEY}`
        }
      ];

      const expectedPayload = {
        locale,
        uuid,
        canLearn: unlocked,
        createdAt: createdAt,
        learnLanguageAlpha3,
        lessonUuid
      };

      store.dispatch(loadSurvey());
      expect(store.getActions()).toEqual(expectedActions);
      expect(surveyService.loadSurvey).toHaveBeenCalledWith(expectedPayload);
    });

    test('sets the cookies for the survey campaign', () => {
      store.dispatch(loadSurvey());

      const cookieSpy = jest.spyOn(cookies, 'setCookie');
      const [cookieName, cookieValue] = cookieSpy.mock.calls[0];

      expect(cookieName).toBe('campaign_opened');
      expect(cookieValue).toBe(1);
    });
  });
});
