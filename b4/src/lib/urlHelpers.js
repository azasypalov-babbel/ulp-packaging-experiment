import parseUrl from 'url-parse';
import camelize from 'camelize';

export function parseQueryParameters(lessonUrl = window.location.href) {
  const { query } = camelize(parseUrl(lessonUrl, true));

  return query;
}

export function normalizeQueryParameters(queryParams = {}) {
  return Object.entries(queryParams).reduce(
    (params, [key, value]) => {
      if (typeof value === 'undefined') {
        return params;
      }
      return {
        ...params,
        [key]: value
      };
    },
    {}
  );
}
