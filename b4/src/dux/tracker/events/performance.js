import getPerformanceTrackingMetrics from '../../../lib/performanceTrackingMetrics';

export const performancePageLoadedEvent = ({ locale, learnLanguageAlpha3 }) => ({
  event: 'performance:page_loaded',
  version: 1,
  /* eslint-disable camelcase */
  payload: {
    locale: locale,
    learn_language_alpha3: learnLanguageAlpha3,
    provider: 'lesson_player',
    ...getPerformanceTrackingMetrics()
  }
  /* eslint-enable camelcase */
});
