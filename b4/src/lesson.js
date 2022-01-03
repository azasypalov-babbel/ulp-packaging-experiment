import { getMyEnv } from '@lessonnine/my.js';

import components from './components';
import session from './dux/session';
import services from './services';

export const startLesson = ({
  locale,
  lessonUuid,
  learnLanguageAlpha3,
  learningActivityId,
  contentReleaseId,
  returnUrl,
  showLessonLandingScreen
}) => {
  const { homeBaseUrl, client } = getMyEnv();
  const priceUrl = homeBaseUrl + '/prices';

  const { translationService } = services;
  translationService.init({ locale });

  session().actions.initSession({
    type: 'LESSON',
    locale,
    learnLanguageAlpha3,
    returnUrl,
    priceUrl,
    client: { ...(client || {}), userAgent: window.navigator.userAgent },
    showLessonLandingScreen
  });

  document.addEventListener('DOMContentLoaded', function onDOMContentLoaded() {
    const node = document.querySelector('[data-main]');

    document.removeEventListener('DOMContentLoaded', onDOMContentLoaded);

    components.mount('LessonApp', { lessonUuid, learningActivityId, contentReleaseId }, node);
  });
};
