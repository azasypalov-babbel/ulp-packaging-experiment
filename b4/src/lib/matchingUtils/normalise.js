import {
  removeLeadingAndTrailingPunctuation,
  createSpecialCharacterReplacements
} from '@lessonnine/babbel-markup-helper.js';

const removeTags = (string) => string.replace(/[#@]/g, '');
const removePunctuation = (string) => string.replace(/[,;:./]/g, '');
const removeUnicodeEllipses = (string) => string.replace(/\u2026/g, '');
const removeDashes = (string) => string.replace(/[－﹣—–‑‐-]\s/g, '');
const removeParentheses = (string) => string.replace(/\([^)]*\)\s/g, '');
const removeExtraSpaces = (string) => string.replace(/\s+/g, ' ');
const stardardString = /^[a-zA-Z0-9]+$/;


const normalisers = [
  removeLeadingAndTrailingPunctuation,
  removeTags,
  removePunctuation,
  removeUnicodeEllipses,
  removeDashes,
  removeParentheses,
  removeExtraSpaces
];

export const normalise = (string, learnLanguageAlpha3) =>
  (learnLanguageAlpha3 === 'DEU') ?
    normalisers
      .reduce((result, normaliser) => normaliser(result), string)
      .trim()
    :
    normalisers
      .reduce((result, normaliser) => normaliser(result), string)
      .trim()
      .toLowerCase();

export const replaceSpecialCharacters = (char) => {
  if (char.match(stardardString)) {
    return char;
  }

  const specialChars = createSpecialCharacterReplacements(char);
  if (!specialChars.length) return char;

  return specialChars
    .filter((string) => string.match(stardardString))
    .find((string) => string.length == 1);
};

export const replaceMatches = (inputString, replacementPairs = []) =>
  replacementPairs.reduce((string, { expression, replacement }) =>
    string.replace(new RegExp(expression, 'ig'), replacement), inputString);

export const stripDiacritics = (string) => string.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
