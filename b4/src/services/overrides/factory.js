import * as features from '../../lib/features';

/**
 * configuration of optional service overrides
 * @typedef {Object} Override
 * @property {S} services partial service layer, that will be merged into the previous layer
 * @property {() => boolean} guard predicate functor
 * @property {string} [name] optional identifier for override
 * @template {{[key: string]: any}} S partial service layer
 */

/**
 * creates a conditional service override which will be applied by evaluating `guard`
 * @template {{[key: string]: any}} T
 * @param {T} services
 * @param {string|{():boolean}} guard either a key of a feature flag as `string` or a predicate functor as `function`
 * @param {string} [name] override name
 * @returns {Override<T>}
 */
export function createServicesOverride(services, guard, name) {
  if (typeof guard === 'string') {
    return createServicesOverride(services, () => features.get(guard), name || guard);
  }
  return {
    name: name || guard.name,
    services,
    guard
  };
}

/**
 * returns a copy of `target` merged with enabled `overrides`
 * @template {{}} T
 * @template {Override<T>} O
 * @param {T} target
 * @param  {...O} overrides
 */
export const applyOverrides = (target, ...overrides) => {
  const filtered = overrides.filter((override) => {
    return override.guard();
  });
  return filtered.reduce((acc, override) => {
    return {
      ...acc,
      ...override.services
    };
  }, target);
};
