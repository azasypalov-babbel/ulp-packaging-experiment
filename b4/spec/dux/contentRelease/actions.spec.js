import mockStore from '../mockStore';
import * as types from '../../../src/dux/contentRelease/types';
import { fetchContentRelease } from '../../../src/dux/contentRelease/actions';
import contentReleaseService from '../../../src/services/contentReleaseService';

jest.mock('../../../src/services/contentReleaseService');

const locale = 'en';
const learnLanguageAlpha3 = 'FRA';

describe('contentRelease Actions', () => {
  const state = {
    session: {
      locale: locale,
      learnLanguageAlpha3: learnLanguageAlpha3
    }
  };
  const store = mockStore(state);

  contentReleaseService.fetchContentRelease.mockImplementation(() => Promise.resolve('ok'));

  afterEach(() => {
    contentReleaseService.fetchContentRelease.mockClear();
    store.clearActions();
  });

  describe('fetchContentRelease', () => {
    test('calls contentRelease service', () => {
      expect.assertions(2);
      const expectedActions = [
        {
          type: `${types.FETCH_CONTENT_RELEASE}_PENDING`
        },
        {
          type: `${types.FETCH_CONTENT_RELEASE}_FULFILLED`,
          payload: 'ok'
        }
      ];

      return store.dispatch(fetchContentRelease())
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
          expect(contentReleaseService.fetchContentRelease).toHaveBeenCalledWith({ locale, learnLanguageAlpha3 });
        });
    });
  });
});
