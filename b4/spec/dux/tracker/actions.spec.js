import { track } from '../../../src/dux/tracker/actions';
import * as types from '../../../src/dux/tracker/types';
import mockStore from '../mockStore';
import { trackingService } from '../../../src/services';

jest.mock('../../../src/services', () => ({
  trackingService: {
    track: jest.fn(() => Promise.resolve())
  }
}));

describe('track action', () => {
  const getStateMock = jest.fn();
  const store = mockStore(getStateMock);

  afterEach(() => {
    store.clearActions();
  });
  test('with object as payload', async () => {
    const mockTrackingEventAction = {
      event: 'test_event',
      version: 0,
      payload: {
        test: 1
      }
    };

    const expected = {
      type: `${types.TRACK}_FULFILLED`,
      payload: mockTrackingEventAction
    };

    await store.dispatch(track(mockTrackingEventAction));

    expect(store.getActions()).toEqual(expect.arrayContaining([expected]));
    expect(trackingService.track).toHaveBeenCalledWith(
      'test_event', 0, { test: 1 }
    );
  });

  test('with function as payload', async () => {
    getStateMock.mockImplementation(() => ({ test: 2 }));

    const mockTrackingEventAction = (state) => ({
      event: 'test_fn_event',
      version: 0,
      payload: {
        test: state.test
      }
    });

    const expected = {
      type: `${types.TRACK}_FULFILLED`,
      payload: {
        event: 'test_fn_event',
        version: 0,
        payload: {
          test: 2
        }
      }
    };

    await store.dispatch(track(mockTrackingEventAction));

    expect(store.getActions()).toEqual(expect.arrayContaining([expected]));

    expect(trackingService.track).toHaveBeenCalledWith(
      'test_fn_event', 0, { test: 2 }
    );
  });
});
