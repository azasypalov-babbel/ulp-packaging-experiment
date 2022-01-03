import Rollbar from 'rollbar';
import { getMyEnv } from '@lessonnine/my.js';
import * as features from '../lib/features';
import NativeRollbarProxyBridge from './nativeRollbarProxyBridge';

const { uuid, environment, rollbarAccessToken: webRollbarAccessToken } = getMyEnv();
const isProduction = process.env.NODE_ENV === 'production';
const buildVersion = process.env.BUILD_COMMIT_HASH;

const isIgnored = (isUncaught, args, payload) => {
  const isUnknownJS =
    payload?.body?.trace?.frames?.[0]?.filename === '(unknown)' ||
    payload?.body?.trace?.exception?.class === '(unknown)';

  const isExceptionStatusCode0 =
    payload?.body?.trace?.exception?.message === 'status code 0';

  return isExceptionStatusCode0 || isUnknownJS;
};

export const getDefaultConfig = () => {
  return {
    accessToken: features.isWebview()
      ? process.env.ROLLBAR_CLIENT_ACCESS_TOKEN
      : webRollbarAccessToken,
    captureUncaught: true,
    captureUnhandledRejections: true,
    enabled: isProduction,
    hostSafeList: [
      'cloudfront.net',
      'my.babbel.com',
      'my.babbel.cn',
      'babbel-local://' // iOS webview
    ],
    checkIgnore: isIgnored,
    payload: {
      environment,
      context: features.isWebview() ? 'webview' : null,
      person: {
        id: uuid
      },
      client: {
        javascript: {
          /* eslint-disable camelcase */
          code_version: buildVersion, // keep track of which build is throwing error
          source_map_enabled: true,
          guess_uncaught_frames: true
          /* eslint-enable camelcase */
        }
      }
    }
  };
};

if (features.isAndroid()) {
  new NativeRollbarProxyBridge();
}

export default Rollbar.init(getDefaultConfig());
