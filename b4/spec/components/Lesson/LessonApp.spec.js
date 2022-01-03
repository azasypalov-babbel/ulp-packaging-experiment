import React from 'react';
import { shallow } from 'enzyme';

import mockStore from '../../dux/mockStore';

jest.mock('../../../src/components/Lesson/LessonSequence', () => () => null);

jest.mock('../../../src/lib/smartSurfaces');
import { isAllowedReferAFriend } from '../../../src/lib/smartSurfaces';

jest.mock('../../../src/dux/statistics/actions');
import { fetchTrainerItemsStatistics } from '../../../src/dux/statistics/actions';

jest.mock('../../../src/dux/profile/actions');
import { fetchProfile } from '../../../src/dux/profile/actions';

jest.mock('../../../src/dux/subscriptions/actions');
import { fetchSubscriptions } from '../../../src/dux/subscriptions/actions';

jest.mock('../../../src/services/rollbarService');
import rollbar from '../../../src/services/rollbarService';

jest.mock('../../../src/dux/tracker/events/lessonSession', () => ({
  lessonSessionEndedAbortEvent: () => ({ event: 'lesson_session:ended:abort' })
}));

import { fetchSmartSurfacesData, LessonApp } from '../../../src/components/Lesson/LessonApp';

const storeMock = {
  session: {
    locale: 'en',
    learnLanguageAlpha3: 'DEU'
  }
};

const defaultProps = {
  initLesson: jest.fn(),
  setContentReleaseId: jest.fn(),
  track: jest.fn(),
  fetchSmartSurfacesData: jest.fn(),
  fetchAccount: jest.fn(),
  locale: 'en',
  learnLanguageAlpha3: 'DEU',
  fetchExperimentBucket: jest.fn().mockReturnValue(Promise.resolve()),
  lessonUuid: 'mock-lesson-uuid',
  learningActivityId: 'mock-learning-activity-id',
  contentReleaseId: 'mock-content-release-id'
};

describe('LessonApp', () => {
  describe('default behaviour', () => {
    let wrapper;
    beforeEach(() => {
      isAllowedReferAFriend.mockReturnValue(true);
      wrapper = shallow(<LessonApp {...defaultProps} />);
    });

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should initialise lesson', () => {
      expect(defaultProps.initLesson)
        .toHaveBeenCalledWith({
          contentReleaseId: 'mock-content-release-id',
          learningActivityId: 'mock-learning-activity-id',
          lessonUuid: 'mock-lesson-uuid'
        });
    });

    it('should track product:view_shown', () => {
      expect(defaultProps.track).toHaveBeenCalledWith({
        event: 'product:view_shown',
        version: 1,
        payload: {
          /* eslint-disable camelcase */
          view_name: 'lesson',
          locale: 'en',
          learn_language_alpha3: 'DEU'
          /* eslint-enable camelcase */
        }
      });
    });

    it('should not fetch experiment bucket', () => {
      expect(defaultProps.fetchExperimentBucket).not.toHaveBeenCalled();
    });

    it('should fetch data for smart surfaces functionality', () => {
      expect(defaultProps.fetchSmartSurfacesData).toHaveBeenCalled();
    });

    test('fetches account information', () => {
      expect(defaultProps.fetchAccount).toHaveBeenCalled();
    });

    it('should not fetch data for smart surfaces functionality when conditions are not met', () => {
      defaultProps.fetchSmartSurfacesData.mockReset();
      isAllowedReferAFriend.mockReturnValue(false);
      shallow(<LessonApp {...defaultProps} />);
      expect(defaultProps.fetchSmartSurfacesData).not.toHaveBeenCalled();
    });
  });

  describe('#fetchSmartSurfacesData', () => {
    let store;
    const getActionCreatorMock = (payload) => () => (
      Promise.resolve({
        action: {
          type: 'MOCK_ACTION',
          payload
        },
        value: payload
      })
    );

    beforeEach(() => {
      fetchTrainerItemsStatistics.mockReturnValue(getActionCreatorMock({}));
      fetchProfile.mockReturnValue(getActionCreatorMock({}));
      fetchSubscriptions.mockReturnValue(getActionCreatorMock([]));
      store = mockStore(storeMock);
    });

    it('should fetch trainer items statistics', async () => {
      await store.dispatch(fetchSmartSurfacesData());
      expect(fetchTrainerItemsStatistics).toHaveBeenCalled();
    });

    it('should notify rollbar with a warning and not interrupt UX in event of an error', async () => {
      fetchTrainerItemsStatistics.mockImplementation(() => () => Promise.reject(Error));
      await store.dispatch(fetchSmartSurfacesData());
      expect(rollbar.warning).toHaveBeenCalled();
    });

    describe('user has completed a lesson', () => {
      beforeEach(() => {
        fetchTrainerItemsStatistics.mockReturnValue(getActionCreatorMock({ totalVocabularyCount: 2 }));
      });

      it('should fetch user profile', async () => {
        await store.dispatch(fetchSmartSurfacesData());
        expect(fetchProfile).toHaveBeenCalled();
      });

      it('should fetch subscriptions if user is not a b2bUser', async () => {
        fetchProfile.mockReturnValue(getActionCreatorMock({ b2bUser: false }));
        await store.dispatch(fetchSmartSurfacesData());
        expect(fetchSubscriptions).toHaveBeenCalled();
      });

      it('should not fetch subscriptions if user is a b2bUser', async () => {
        fetchProfile.mockReturnValue(getActionCreatorMock({ b2bUser: true }));
        await store.dispatch(fetchSmartSurfacesData());
        expect(fetchSubscriptions).not.toHaveBeenCalled();
      });
    });

    describe('user has not completed a lesson', () => {
      beforeEach(async () => {
        fetchTrainerItemsStatistics.mockReturnValue(getActionCreatorMock({ totalVocabularyCount: 0 }));
        await store.dispatch(fetchSmartSurfacesData());
      });

      it('should not fetch user profile', () => {
        expect(fetchProfile).not.toHaveBeenCalled();
      });

      it('should not fetch subscriptions', () => {
        expect(fetchSubscriptions).not.toHaveBeenCalled();
      });
    });
  });
});
