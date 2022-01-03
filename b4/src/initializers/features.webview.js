import * as features from '../lib/features';
import { getMyEnv } from '@lessonnine/my.js';
import parseUrl from 'url-parse';
import { handleKeyDown } from '../lib/keyboardEvents';

const { environment } = getMyEnv();
const { query } = parseUrl(window.location.href, true);

features.configure({
  is_unlocked: 'on', // no paywall in webviews
  is_native_speech: 'on',
  is_verbose_logging: 'off',
  is_transliteration: 'off',
  is_debug: environment === 'production' ? 'off' : 'on',
  ...query
});

document.addEventListener('keydown', handleKeyDown);
