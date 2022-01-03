import * as babbelMarkupHelper from '@lessonnine/babbel-markup-helper.js';
import * as features from '../lib/features';

import components from '../components';
import review from '../dux/review';
import sequence from '../dux/sequence';
import { createTextBoxWrapper, isMobileTextBoxSupported } from './components/textBoxWrapper';
import session from '../dux/session';
import mediaURL from '../services/mediaUrlService';
import getTranslations from '../lib/translations/';
import { isAnalyzerLibRecognizerSupported } from '../lib/speechHelper';

export default () => {
  const translations = getTranslations();

  window.b3.proxy.inject({
    components,
    dux: {
      review: review(),
      sequence: sequence(),
      session: session()
    },
    isWebview: features.isWebview(),
    mediaURL,
    translations,
    babbelMarkupHelper,
    isSpeechSupported: isAnalyzerLibRecognizerSupported,
    writing: {
      isMobileTextBoxSupported,
      createTextBoxWrapper
    }
  });
};
