import { compose } from '../lib/compose';
import {
  formatParentheses,
  getFirstCorrectSolution,
  removeGapFormatting,
  removeFirstParanthesesAndGapsFormatting,
  markupStringToPlainText
} from '@lessonnine/babbel-markup-helper.js';

const commonFormat = compose(
  removeGapFormatting,
  formatParentheses,
  markupStringToPlainText
);

export const formatDL = (s) => {
  if (!s) return '';

  return compose(
    removeFirstParanthesesAndGapsFormatting,
    commonFormat
  )(s);
};

export const formatLL = (s) => {
  if (!s) return '';

  return compose(
    commonFormat,
    getFirstCorrectSolution
  )(s);
};

export const stripParantheses = (text) => text.replace(/(\([\S]+\))/g, '').trim();

