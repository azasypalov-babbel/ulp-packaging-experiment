import { hasGap } from '@lessonnine/babbel-markup-helper.js';

export const isTask = (item) => item.type === 'task';
export const isPhrase = (item) => item.type === 'phrase';
export const isInteractive = (item) => {
  return !item.nonInteractive && (
    (typeof item.displayLanguageText === 'string' && hasGap(item.displayLanguageText)) ||
    (typeof item.learnLanguageText === 'string' && hasGap(item.learnLanguageText))
  );
};
