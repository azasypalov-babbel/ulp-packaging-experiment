/*
 * turns an object with state selectors into a map with
 * selectors bound to the state
 *
 * e.g. for sequence selectors:
 * ```
 *   sequenceSelectors = bindSelectors(selectors, () => getState().sequence)
 *   sequenceSelectors.itemsInTrainer() // => 5
 * ```
 */
export default function(selectors, getState) {
  const boundSelectorsMap = {};

  Object.keys(selectors).forEach((s) => {
    boundSelectorsMap[s] = () => selectors[s](getState());
  });

  return boundSelectorsMap;
}
