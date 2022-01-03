import { offlineAction, isOfflineAction } from '../../../src/dux/offlineQueue/actionDecorators';

describe('actionDecorators', () => {
  describe('#offlineAction', () => {
    test('adds metadata', () => {
      expect(offlineAction({ type: 'foo' }))
        .toEqual(expect.objectContaining({ type: 'foo', meta: { queueIfOffline: true } }));
    });

    test('preserves thunk action', () => {
      const action = offlineAction(() => ({ type: 'foo' }));
      expect(action).toEqual(expect.any(Function));
      expect(isOfflineAction(action)).toEqual(true);
    });
  });
});
