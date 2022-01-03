import shuffle, { DEFAULT_SEED } from '../../src/lib/shuffle';
import { isEqual } from "lodash";

const factorial = (n) =>
  // eslint-disable-next-line no-nested-ternary
  n < 0
    ? (() => {
      throw new TypeError('Negative numbers are not allowed!');
    })()
    : n <= 1
      ? 1
      : n * factorial(n - 1);

const standardDeviation = (arr, usePopulation = false) => {
  const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length;
  return Math.sqrt(
    arr.reduce((acc, val) => acc.concat((val - mean) ** 2), []).reduce((acc, val) => acc + val, 0) /
      (arr.length - (usePopulation ? 0 : 1))
  );
};

/**
 * Generates a unique index for a permutation of a list of numbers
 * https://www.jaapsch.net/puzzles/compindx.htm#perm
 */
const permutationIndex = (permutation) => {
  const n = permutation.length;
  return permutation.reduce((t, number, index) => {
    const j = permutation.slice(index + 1).reduce((a, b) => {
      if (number > b) return a + 1;
      return a;
    }, 0);
    return (t * (n - index)) + j;
  }, 0);
};

/**
 * Given an array of numbers, there is array.length factorial
 * unique permutations of that list.
 * This function calls fn with the same list and tracks how many times the same permutation occurs.
 */
const getDistribution = (fn, n = 5, t = 1000) => {
  const nPerm = factorial(n);
  const testArray = Array(n).fill().map((_, index) => index);
  const trials = t * nPerm;

  const distribution = Array(nPerm).fill(0);

  Array(trials).fill().forEach(() => {
    const result = permutationIndex(fn(testArray));
    distribution[result] += 1;
  });

  return distribution;
};

describe('shuffle', () => {
  describe('without seed', () => {
    it('returns an array of the same length as supplied', () => {
      const input = [1, 2, 3, 4, 5, 6];
      expect(shuffle({ array: input })).toHaveLength(input.length);
    });
    it('should have an even distribution of outcomes', () => {
      const distribution = getDistribution(
        (list) => shuffle({ array: list })
      );

      /**
       * A good random function should be evenly distributed
       * across all possible outcomes.
       * A lower the standard deviation means more evenly distributed the results.
       */
      expect(standardDeviation(distribution)).toBeLessThan(50);
    });

    it('returns the same order if array has length of 1', () => {
      const input = [1];
      expect(shuffle({ array: input})).toEqual(input);
    });

    it ('can return the same order as it was initially', () => {
      const input = [1, 2, 3];
      const trials = Array(30).fill()
      expect(trials.some(() => isEqual(shuffle({ array: input}), input))).toBeTruthy()
    })

    describe('notOriginalOrder is true', () => {
      it('never returns the same order', () => {
        const input = [1, 2, 3];

        for (let i = 0; i < 20; i++) {
          expect(shuffle({ array: input, notOriginalOrder: true })).not.toEqual(input);
        }
      });
    })
  });

  describe('with seed', () => {
    it('returns an array of the same length as supplied', () => {
      const seed = Math.random() * 1000;
      const input = [1, 2, 3, 4, 5, 6];
      expect(shuffle({ array: input, seed })).toHaveLength(input.length);
    });

    it('returns the same result given the same seed', () => {
      const seed = Math.random() * 1000;
      const input = [1, 2, 3, 4, 5, 6];
      const shuffle1 = shuffle({ array: input, seed });
      const shuffle2 = shuffle({ array: input, seed });

      expect(shuffle1).toEqual(shuffle2);
    });

    it('returns the same order if array has length of 1', () => {
      const seed = Math.random() * 1000;
      const input = [1];
      expect(shuffle({ array: input, seed })).toEqual(input);
    });

    it('can return the same order as provided', () => {
      const seed = 0.89 * 1000;
      const input = [1, 2, 3];
      expect(shuffle({ array: input, seed })).toEqual(input);
    });

    it('DEFAULT_SEED does not return same order for varying array lengths', () => {
      for (let i = 2; i < 20; i++) {
        const input = [...new Array(i).keys()]
        expect(shuffle({ array: input, seed: DEFAULT_SEED })).not.toEqual(input);
      }
    });

    it('should have an even distribution of outcomes', () => {
      const distribution = getDistribution(
        (list) => shuffle({ array: list, seed: Math.random() * 1000 })
      );

      /**
       * Seeded random performs a bit worse than without seed.
       * However that is fine for our use-case.
       */
      expect(standardDeviation(distribution)).toBeLessThan(60);
    });

    describe('notOriginalOrder is true', () => {
      it('never returns the same order', () => {
        const seed = 0.89 * 1000;
        const input = [1, 2, 3];

        for (let i = 0; i < 20; i++) {
          expect(shuffle({ array: input, seed, notOriginalOrder: true })).not.toEqual(input);
        }
      });
    })
  });
});
