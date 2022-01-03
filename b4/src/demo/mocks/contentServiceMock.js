import camelize from 'camelize';
import * as features from '../../lib/features';
import { log } from '../../lib/logging';

const fetchLearnLanguage = () => {
  return import(/* webpackChunkName: "demo" */ '../data/learn-language.json').then((module) => {
    const learnLanguage = camelize(module.default.learn_language);

    const response = {
      ...learnLanguage,
      unlocked: features.get('is_unlocked')
    };

    log('contentServiceMock#fetchLearnLanguage', response);

    return (response);
  });
};

export default { fetchLearnLanguage };
