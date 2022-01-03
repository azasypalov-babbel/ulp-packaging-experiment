import { buildPath, buildPathV5 } from '../../src/lib/apiPathHelper';

const learnLanguageAlpha3 = 'FRA';
const locale = 'en';
const uuid = '12345';
const version = '1.1.0';

const contentReleaseId = 'fake-content-release-id';

describe('Api Path Helper', () => {
  describe('#buildPath', () => {
    test('throws error when passing incorrect params', () => {
      expect(() => buildPath({ version, uuid, learnLanguageAlpha3 }))
        .toThrow('Missing required param "locale"');
    });

    test(
      'returns a correct path when passing correct params with empty api path',
      () => {
        const path = buildPath({ version, locale, uuid, learnLanguageAlpha3 });

        expect(path).toEqual('v1.1.0/en/accounts/12345/learn_languages/FRA/');
      }
    );

    test(
      'returns a correct path when passing correct params with api path',
      () => {
        const path = buildPath({ version, locale, uuid, learnLanguageAlpha3 }, 'foo/bar');

        expect(path).toEqual('v1.1.0/en/accounts/12345/learn_languages/FRA/foo/bar');
      }
    );

    test('returns a correct path when passing different version', () => {
      const path = buildPath({ version: '1.0.0', locale, uuid, learnLanguageAlpha3 });

      expect(path).toEqual('v1.0.0/en/accounts/12345/learn_languages/FRA/');
    });
  });

  describe('#buildPathV5 for APIv5', () => {
    test('throws error when passing incorrect params', () => {
      expect(() => buildPathV5({ version: '2', locale, uuid, learnLanguageAlpha3 }))
        .toThrow('Missing required param "contentReleaseId"');
    });

    test('returns a correct path when passing correct params with empty api path', () => {
      const path = buildPathV5({ version: '2', locale, uuid, contentReleaseId, learnLanguageAlpha3 });

      expect(path).toEqual('v2/en/accounts/12345/content_releases/fake-content-release-id/learn_languages/FRA/');
    });

    test('returns a correct path when passing correct params with api path', () => {
      const path = buildPathV5({ version: '2', locale, uuid, contentReleaseId, learnLanguageAlpha3 }, 'foo/bar');

      expect(path).toEqual(
        'v2/en/accounts/12345/content_releases/fake-content-release-id/learn_languages/FRA/foo/bar'
      );
    });
  });
});
