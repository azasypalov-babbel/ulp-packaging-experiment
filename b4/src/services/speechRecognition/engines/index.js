import { ENGINE_NAME as NATIVE_SPEECH } from './bridged/constants';
import { ENGINE_NAME as WEB_SPEECH } from './webApi/constants';
import { ENGINE_NAME as LEGACY_SPEECH } from './legacy/constants';
import { ENGINE_NAME as MOCKED_SPEECH } from './mocked/constants';

export const types = {
  NATIVE_SPEECH,
  WEB_SPEECH,
  LEGACY_SPEECH,
  MOCKED_SPEECH
};

export default [NATIVE_SPEECH, WEB_SPEECH, LEGACY_SPEECH, MOCKED_SPEECH];
