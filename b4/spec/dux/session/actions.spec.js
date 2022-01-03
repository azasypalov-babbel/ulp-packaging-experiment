import mockStore from '../mockStore';
import { navigateToReturnUrl, initMicSettings, setMicSettings } from '../../../src/dux/session/actions';
import * as sessionSelectors from '../../../src/dux/session/selectors';
import { INIT_MIC_SETTINGS, SET_MIC_SETTINGS } from '../../../src/dux/session/types';
import { navigationService } from '../../../src/services';

jest.mock('../../../src/dux/session/selectors', () => ({
  isLesson: jest.fn(),
  isReview: jest.fn()
}));

jest.mock('../../../src/services', () => ({
  navigationService: {
    assign: jest.fn()
  }
}));

describe('session actions', () => {
  const dispatchMock = jest.fn();
  const getStateMock = jest.fn();
  const store = mockStore(getStateMock);

  afterEach(() => {
    dispatchMock.mockClear();
    getStateMock.mockClear();
    store.clearActions();
  });

  describe('initIsMicEnabled', () => {
    test('payload as expected', () => {
      const expected = {
        type: INIT_MIC_SETTINGS,
        payload: {
          isMicEnabled: null
        }
      };

      store.dispatch(initMicSettings());

      expect(store.getActions()[0]).toEqual(expected);
    });
  });

  describe('setIsMicEnabled', () => {
    test('payload as expected', () => {
      const expected = {
        type: SET_MIC_SETTINGS,
        payload: {
          isMicEnabled: true
        }
      };

      store.dispatch(setMicSettings(true));

      expect(store.getActions()[0]).toEqual(expected);
    });
  });

  describe('#navigateToReturnUrl', () => {
    describe('when returnUrl is present', () => {
      test('navigates to return url', () => {
        getStateMock.mockReturnValue({
          session: {
            returnUrl: 'mocked-return-url'
          }
        });

        store.dispatch(navigateToReturnUrl());

        expect(navigationService.assign).toHaveBeenCalledWith('mocked-return-url');
      });
    });

    describe('when returnUrl is undefined, and the user is in Lesson', () => {
      beforeEach(() => {
        sessionSelectors.isLesson.mockImplementation(() => true);
        sessionSelectors.isReview.mockImplementation(() => false);
      });

      afterEach(() => {
        sessionSelectors.isLesson.mockClear();
        sessionSelectors.isReview.mockClear();
      });

      test('navigates to Dashboard', () => {
        getStateMock.mockReturnValue({
          session: {
            returnUrl: null
          }
        });
        store.dispatch(navigateToReturnUrl());

        expect(navigationService.assign).toHaveBeenCalledWith('/dashboard');
      });
    });

    describe('when returnUrl is undefined, and the user is in Review', () => {
      beforeEach(() => {
        sessionSelectors.isReview.mockImplementation(() => true);
        sessionSelectors.isLesson.mockImplementation(() => false);
      });

      afterEach(() => {
        sessionSelectors.isLesson.mockClear();
        sessionSelectors.isReview.mockClear();
      });

      test('navigates to Review Manager', () => {
        getStateMock.mockReturnValue({
          session: {
            returnUrl: null
          }
        });
        store.dispatch(navigateToReturnUrl());

        expect(navigationService.assign).toHaveBeenCalledWith('/review-manager');
      });
    });
  });
});
