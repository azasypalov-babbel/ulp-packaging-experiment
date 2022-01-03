import * as features from '../lib/features';
import { getMyEnv } from '@lessonnine/my.js';
import parseUrl from 'url-parse';
import { handleKeyDown } from '../lib/keyboardEvents';

const { environment } = getMyEnv();
const { query } = parseUrl(window.location.href, true);
features.configure({
  is_transliteration: 'on',
  is_refer_a_friend: 'on',
  is_debug: environment === 'production' ? 'off' : 'on',
  ...query
});

document.addEventListener('keydown', handleKeyDown);
