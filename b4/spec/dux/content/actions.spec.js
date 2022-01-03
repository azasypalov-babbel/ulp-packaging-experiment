import mockStore from '../mockStore';
import * as types from '../../../src/dux/content/types';
import { fetchLearnLanguage } from '../../../src/dux/content/actions';
import contentService from '../../../src/services/contentService';

jest.mock('../../../src/services/contentService');

const mockLearningActivityId = '1234';
const locale = 'en';
const learnLanguageAlpha3 = 'FRA';
const contentReleaseId = 'fake-content-release-id';

describe('Content Actions', () => {
  const state = {
    session: {
      type: 'LESSON',
      locale: locale,
      learnLanguageAlpha3: learnLanguageAlpha3
    },
    contentRelease: {
      data: {
        id: 'fake-content-release-id'
      }
    },
    lesson: {
      learningActivityId: mockLearningActivityId
    },
    content: {
      data: {
        courseOverviews: []
      }
    }
  };
  const store = mockStore(state);

  contentService.fetchLearnLanguage.mockImplementation(() => Promise.resolve({
    unlocked: true
  }));

  afterEach(() => {
    jest.clearAllMocks();
    store.clearActions();
  });

  test('calls content service', () => {
    expect.assertions(2);
    const expectedActions = [
      {
        type: `${types.FETCH_LEARN_LANGUAGE}_PENDING`
      },
      {
        type: `${types.FETCH_LEARN_LANGUAGE}_FULFILLED`,
        payload: {
          unlocked: true
        }
      }
    ];

    return store.dispatch(fetchLearnLanguage())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(contentService.fetchLearnLanguage).toHaveBeenCalledWith({
          locale,
          learnLanguageAlpha3,
          contentReleaseId
        });
      });
  });
});
