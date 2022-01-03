import router from '../lib/router';
import parseUrl from 'url-parse';
import camelize from 'camelize';

import { startLesson } from '../lesson';
import { startReview } from '../review';

export default () => {
  const { query: queryParameters } = camelize(parseUrl(window.location.href, true));

  router.get('/:locale/:appSlug/:learnLanguageAlpha3?/demo', (req, event) => {
    event.stopPropagation();
    import(/* webpackChunkName: "demo" */ '../demo/index').then((startLessonDemo) => {
      startLessonDemo.default();
    });
  });

  router.get('/:locale/:appSlug/:learnLanguageAlpha3/review', (req, event) => {
    event.stopPropagation();
    const { isSearch, returnUrl, selectedInteraction } = queryParameters;
    startReview({ ...req.params, isSearch, returnUrl, selectedInteraction });
  });

  router.get('/:locale/:appSlug/:learnLanguageAlpha3/:lessonUuid', (req, event) => {
    event.stopPropagation();
    const { learningActivityId, contentReleaseId, returnUrl, showLessonLandingScreen } = queryParameters;
    startLesson({
      ...req.params,
      learningActivityId,
      contentReleaseId,
      returnUrl,
      showLessonLandingScreen
    });
  });

  if (process.env.WEBVIEW === '1') {
    router.get('/lesson/static', (req, event) => {
      event.stopPropagation();

      const configElement = document.querySelector('script[data-static]');

      const data = JSON.parse(configElement.text);

      const { id: lessonUuid } = data.lesson;
      const { alpha3: learnLanguageAlpha3 } = data.language_combination.learn_language;
      const { locale_identifier: locale } = data.language_combination.display_language;

      const contentReleaseId = 'mocked-content-release-id'; // TODO
      const learningActivityId = data.learn_language.course_overviews[0].courses[0].lessons[0].id;

      startLesson({ locale, learnLanguageAlpha3, lessonUuid, learningActivityId, contentReleaseId });
    });
  }
};
