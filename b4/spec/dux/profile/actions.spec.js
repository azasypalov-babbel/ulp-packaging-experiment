import mockStore from '../mockStore';
import * as types from '../../../src/dux/profile/types';
import { fetchProfile } from '../../../src/dux/profile/actions';
import profileService from '../../../src/services/profileService';

jest.mock('../../../src/services/profileService');

describe('Profile Actions', () => {
  const state = {
    session: {
      locale: 'en'
    }
  };
  const store = mockStore(state);

  profileService.fetchProfile.mockImplementation(() => Promise.resolve('ok'));

  afterEach(() => {
    profileService.fetchProfile.mockClear();
    store.clearActions();
  });

  test('calls profile service', async () => {
    const expectedActions = [
      {
        type: `${types.FETCH_PROFILE}_PENDING`
      },
      {
        type: `${types.FETCH_PROFILE}_FULFILLED`,
        payload: 'ok'
      }
    ];

    await store.dispatch(fetchProfile());
    expect(store.getActions()).toEqual(expectedActions);
    expect(profileService.fetchProfile).toHaveBeenCalledWith(state.session.locale);
  });
});
