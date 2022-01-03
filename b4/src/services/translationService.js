import Pidgin from '@lessonnine/pidgin.js';
import rollbar from './rollbarService';

import de from '../../../lang/lesson_player/de';
import en from '../../../lang/lesson_player/en';
import en_dev from '../../../lang/lesson_player/en_dev'; // eslint-disable-line camelcase
import en_GB from '../../../lang/lesson_player/en_GB'; // eslint-disable-line camelcase
import es from '../../../lang/lesson_player/es';
import fr from '../../../lang/lesson_player/fr';
import it from '../../../lang/lesson_player/it';
import pl from '../../../lang/lesson_player/pl';
import pt from '../../../lang/lesson_player/pt';
import sv from '../../../lang/lesson_player/sv';

let instance;

const init = ({ locale }) => {
  const locales = { de, en, en_dev, en_GB, es, fr, it, pl, pt, sv };

  const onMissingKey = (key) => {
    console.warn(`Missing translation for key: "${key}"`);
    rollbar.warning('Missing translation', { key, locale });
  };

  instance = new Pidgin({ locale, locales, onMissingKey });
};

const translate = (key, interpolation) => {
  if (!instance) {
    throw new Error('translationService not initialized. Ensure to call translationService.init()');
  }

  const translateWithNamespace = instance.namespace('lesson_player');
  return translateWithNamespace(key, interpolation);
};

export default {
  init,
  translate
};
