import babbelTracker from '@lessonnine/tracker.js/dist/tracker.js';
import { getMyEnv } from '@lessonnine/my.js';
import prefixTrackerUrl from '../dux/tracker/prefixUrl';
import { isWebview } from '../lib/features';

let tracker;

const formatTrackingErrorMessage = ({ name, version, originalError }) => {
  return `${originalError} while trying to track event: ${name} v${version}`;
};

class TrackingError extends Error  {
  constructor({ name, version, originalError }) {
    super(formatTrackingErrorMessage({ name, version, originalError }));
    this.name = 'TrackingError';
    this.originalError = originalError;
    this.trackingEvent = {
      name, version
    };
  }
}

const track = (name, version, payload = {}) => {
  const { uuid, apigatewayBaseUrl } = getMyEnv();
  const trackerUrl = apigatewayBaseUrl ? `${apigatewayBaseUrl}/v1/events` : null;

  tracker = tracker || new babbelTracker.Tracker({
    url: prefixTrackerUrl(trackerUrl),
    trackingUuidName: 'babbeltrackinguuid',
    userUuid: uuid,
    useFetch: isWebview()
  });

  return new Promise((resolve, reject) => {
    tracker.track({
      name,
      version,
      payload,
      success: resolve,
      error: (error) => reject(new TrackingError({ name, version, originalError: error }))
    });
  });
};

export default {
  track
};
