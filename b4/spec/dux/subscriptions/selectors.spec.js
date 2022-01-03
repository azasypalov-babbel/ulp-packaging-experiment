import { subscriptionDate } from '../../../src/dux/subscriptions/selectors';

describe('subscriptions selectors', () => {
  describe('subscriptionDate', () => {
    test('returns start date of active subscription', () => {
      const date = '2018-11-25';
      const state = {
        data: [
          { startStateDate: '2016-09-23', active: false },
          { startStateDate: date, active: true },
          { startStateDate: '2017-10-24', active: false }
        ]
      };

      expect(subscriptionDate(state)).toEqual(date);
    });

    test('returns null if no active subscriptions', () => {
      const state = { data: [{ startStateDate: '2017-10-24', active: false }] };
      expect(subscriptionDate(state)).toEqual(null);
    });

    test('returns null if state data empty', () => {
      const state = { data: [] };
      expect(subscriptionDate(state)).toEqual(null);
    });

    test('returns null if no state data available', () => {
      const state = { data: null };
      expect(subscriptionDate(state)).toEqual(null);
    });
  });
});
