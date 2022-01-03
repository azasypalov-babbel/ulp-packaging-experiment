import { pick } from 'underscore';

const toSnakeCase = (key) =>
  key.replace(/([A-Z])/g, '_$1').toLowerCase();

const renameKeys = (keyMap, obj) =>
  Object.keys(obj).reduce(
    (acc, key) => ({
      ...acc,
      ...{ [keyMap(key) || key]: obj[key] }
    }),
    {}
  );

const toSnakeCaseObject = (object) => renameKeys(toSnakeCase, object);

const PERFORMANCE_ATTRIBUTES = ['navigationStart', 'unloadEventStart',
  'unloadEventEnd', 'redirectStart', 'redirectEnd', 'fetchStart',
  'domainLookupStart', 'domainLookupEnd', 'connectStart', 'connectEnd',
  'secureConnectionStart', 'requestStart', 'responseStart', 'responseEnd',
  'domLoading', 'domInteractive', 'domContentLoadedEventStart',
  'domContentLoadedEventEnd', 'domComplete', 'loadEventStart', 'loadEventEnd'
];

const getPerformanceTrackingMetrics = () =>
  toSnakeCaseObject(pick(performance.timing, PERFORMANCE_ATTRIBUTES));

export default getPerformanceTrackingMetrics;
