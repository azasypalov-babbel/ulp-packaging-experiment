import * as features from '../../lib/features';

const nativeTrackerPrefix = 'babbel-local://app/tracker/';
// match any http-ish protocol (including "//*" )
const reHttp = /^(https?:)?\/\//i;

export default function prefixTrackerUrl(url) {
  if (typeof url === 'string' && features.isWebview()) {
    return url.replace(reHttp, nativeTrackerPrefix);
  }
  return url;
}
