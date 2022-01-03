export const defaultSubstitutionCosts = { characterSubstitutionCosts: [] };

/**
 * @typedef {{
   character: string
   replacement: string
   cost: number
 }} SubstitutionOption
 */

/**
 * @param {string} learnLanguageAlpha3
 * @returns {Promise<Array<SubstitutionOption>>}
 */
export const fetchSubstitutionCosts = (learnLanguageAlpha3) =>
  import(
    /* webpackChunkName: "substitutionCosts/[request]" */
    `./substitutionCosts/${learnLanguageAlpha3}.json`
  )
    .catch(() => Promise.resolve(defaultSubstitutionCosts))
    .then(({ characterSubstitutionCosts }) => characterSubstitutionCosts);
