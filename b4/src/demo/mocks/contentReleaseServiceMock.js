import { log } from '../../lib/logging';

const fetchContentRelease = ({ locale, learnLanguageAlpha3 }) => {
  const id = 'fake-content-release-id';
  const response = { id, locale, learnLanguageAlpha3 };

  log('contentReleaseServiceMock#fetchContentRelease', response);

  return Promise.resolve(response);
};

export default {
  fetchContentRelease
};
