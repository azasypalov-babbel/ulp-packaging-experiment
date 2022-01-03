export const buildPath = ({ version, locale, uuid, learnLanguageAlpha3 }, rest = '') => {
  if (!version) {
    throw 'Missing required param "version"';
  }
  if (!locale) {
    throw 'Missing required param "locale"';
  }
  if (!uuid) {
    throw 'Missing required param "uuid"';
  }
  if (!learnLanguageAlpha3) {
    throw 'Missing required param "learnLanguageAlpha3"';
  }

  return `v${version}/${locale}/accounts/${uuid}/learn_languages/${learnLanguageAlpha3}/${rest}`;
};

export const buildPathV5 = ({ version, locale, uuid, contentReleaseId, learnLanguageAlpha3 }, rest = '') => {
  if (!version) {
    throw 'Missing required param "version"';
  }
  if (!locale) {
    throw 'Missing required param "locale"';
  }
  if (!uuid) {
    throw 'Missing required param "uuid"';
  }
  if (!learnLanguageAlpha3) {
    throw 'Missing required param "learnLanguageAlpha3"';
  }
  if (!contentReleaseId) {
    throw 'Missing required param "contentReleaseId"';
  }

  return `v${version}/${locale}/accounts/${uuid}/content_releases/${contentReleaseId}` +
    `/learn_languages/${learnLanguageAlpha3}/${rest}`;
};
