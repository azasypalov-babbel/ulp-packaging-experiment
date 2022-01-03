import * as features from '../../src/lib/features';
import cookies from '../../src/lib/cookies';
jest.mock('../../src/lib/cookies');

cookies.getCookies.mockImplementation(() => ({}));

const allowedFeatures = [
  'is_something',
  'is_something_else',
  'is_something_persistent',
  'is_something_non_persistent'
];
const nonPersistentFeatures = [
  'is_something_non_persistent'
];

describe('features', function() {
  describe('#configure', function() {
    let RealDate;
    const date = new Date('1961-04-12T06:07:00');
    const dateInOneYear = new Date('1962-04-12T06:07:00');

    beforeEach(function() {
      RealDate = Date;
      // eslint-disable-next-line no-global-assign
      Date = class extends Date {
        constructor() {
          super();
          return date;
        }
      };
    });

    afterEach(function() {
      // eslint-disable-next-line no-global-assign
      Date = RealDate;
    });

    test('filters queryParameters and sets cookies with expiration date', function() {
      features.configure({
        is_something: 'on',
        is_something_else: 'off',
        learn_language: 'FRA'
      }, allowedFeatures);

      expect(cookies.setCookie).toHaveBeenCalledTimes(2);
      expect(cookies.setCookie.mock.calls).toEqual([
        ['is_something', 'on', dateInOneYear],
        ['is_something_else', 'off', dateInOneYear]
      ]);
    });
  });

  describe('#get', function() {
    describe('when configured with param', function() {
      test('returns true if its value configured with \'on\'', function() {
        cookies.getCookies.mockReturnValue({ is_something: 'off' });
        features.configure({ is_something: 'on' }, allowedFeatures, nonPersistentFeatures);

        expect(features.get('is_something')).toBe(true);
      });
    });

    describe('when cookie has feature', function() {
      test('returns true if its value is \'on\'', function() {
        cookies.getCookies.mockReturnValue({ is_something_persistent: 'on' });
        features.configure({}, allowedFeatures, nonPersistentFeatures);

        expect(features.get('is_something_persistent')).toBe(true);
      });
      test('returns false if its value is \'off\'', function() {
        cookies.getCookies.mockReturnValue({ is_something_persistent: 'off' });
        features.configure({}, allowedFeatures, nonPersistentFeatures);

        expect(features.get('is_something_persistent')).toBe(false);
      });
    });
    describe('when cookie doesn\'t have feature', function() {
      test('returns null', function() {
        cookies.getCookies.mockReturnValue({});
        features.configure({}, allowedFeatures, nonPersistentFeatures);

        expect(features.get('is_something_persistent')).toBeNull();
      });
    });

    describe('when feature is marked as non persistent', function() {
      test('returns null', function() {
        cookies.getCookies.mockReturnValue({ is_something_non_persistent: 'on' });
        features.configure({}, allowedFeatures, nonPersistentFeatures);

        expect(features.get('is_something_non_persistent')).toBeNull();
      });
    });
  });

  describe('#getActiveFeatures', function() {
    describe('when cookie has active feature', function() {
      test('returns an array', function() {
        const allowedFeatures = ['is_something'];
        cookies.getCookies.mockReturnValue({ is_something: 'on' });
        features.configure({}, allowedFeatures, nonPersistentFeatures);
        expect(features.getActiveFeatures(allowedFeatures)).toEqual(['is_something']);
      });
    });
    describe('when cookie doesn\'t have active feature', function() {
      test('returns an empty array', function() {
        cookies.getCookies.mockReturnValue({ is_something: 'off' });
        features.configure({}, allowedFeatures, nonPersistentFeatures);
        expect(features.getActiveFeatures()).toEqual([]);
      });
    });
  });
});
