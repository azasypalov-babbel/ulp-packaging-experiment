import { defaultSubstitutionCosts } from './fetchSubstitutionCosts';

const escapeRegex = (string) => string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

/**
 * This function returns referenceText mapped with information about which caracters have been used in inputText.
 * Optionally, an order list can be provided to specify which exact character was used.
 * order is a list of referenceText indexes that have been used. Order should be no longer than inputText.
 */
export const mapUsedTokens = ({
  inputText,
  referenceTokens,
  substitutionCosts = defaultSubstitutionCosts.characterSubstitutionCosts,
  order = []
}) => {
  const findSubstitutions = (char) =>
    substitutionCosts
      .filter(({ character }) => character == char)
      .reduce((replacements, { replacement }) => [...replacements, replacement], []);

  const matchToken = (token) => new RegExp(token.split('')
    .map((character) => {
      const subs = findSubstitutions(character);
      return [character, ...subs].join('|');
    })
    .map((characterSet) => `[${escapeRegex(characterSet)}]`)
    .join(''));

  const usedByOder = order.map((index) => referenceTokens[index]);

  const resultTokensInitial = referenceTokens
    .map((token, index) => ({ used: false, token: token, id: index }));

  /**
   * First consider tokens by `order` index list
   */
  const resultTokensOrder = resultTokensInitial
    .map((item) => ({
      ...item,
      used: order.includes(item.id)
    }));

  const reducedInputText = usedByOder
    .reduce((text, usedToken) =>
      text.replace(usedToken, '')
    , inputText);

  /**
   * Then look for matches for the remaining input text
   */
  const resultTokens = resultTokensOrder
    .reduce((previouslyChecked, current) => {
      if (current.used) {
        return [...previouslyChecked, current];
      }

      const notPreviouslyUsed = previouslyChecked
        .filter(({ used }) => used)
        // Ignore tokens that have been mapped already in the previous section
        .filter(({ id }) => !order.includes(id))
        .reduce(
          (text, item) => text.replace(matchToken(item.token), ''),
          reducedInputText
        );

      const used = matchToken(current.token).test(notPreviouslyUsed);

      return [
        ...previouslyChecked,
        { ...current, used }
      ];
    }
    , []);

  return resultTokens;
};
