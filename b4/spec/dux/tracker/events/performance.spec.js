import getPerformanceTrackingMetrics from '../../../../src/lib/performanceTrackingMetrics';
import {
  performancePageLoadedEvent
} from '../../../../src/dux/tracker/events/performance';

jest.mock('../../../../src/lib/performanceTrackingMetrics');

describe('performance events', () => {
  describe('performance:page_loaded', () => {
    beforeEach(() => {
      getPerformanceTrackingMetrics.mockImplementation(() => ({
        connect_end: 1559831288237,
        connect_start: 1559831288237,
        dom_complete: 1559831290414,
        dom_content_loaded_event_end: 1559831289480,
        dom_content_loaded_event_start: 1559831289323
      }));
    });

    test('performance:page_loaded', () => {
      expect(
        performancePageLoadedEvent({ locale: 'en', learnLanguageAlpha3: 'DEU' })
      ).toMatchSnapshot();
    });
  });
});
