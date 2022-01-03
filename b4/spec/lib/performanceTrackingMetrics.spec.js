import getPerformanceTrackingMetrics from '../../src/lib/performanceTrackingMetrics';

describe('performanceTrackingMetrics', () => {
  beforeEach(() => {
    Object.defineProperty(window.performance, 'timing', { value: {
      navigationStart: 2000000,
      fetchStart: 200000
    },
    writable: true
    });
  });

  it('should return snake case metrics from performance.timing', () => {
    expect(getPerformanceTrackingMetrics()).toEqual(
      {
        navigation_start: 2000000,
        fetch_start: 200000
      }
    );
  });
});
