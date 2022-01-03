import * as features from './features';


export const log = (...args) => {
  if (features.get('is_verbose_logging')) {
    // eslint-disable-next-line no-console
    console.log(...args);
  }
};
