import { isEqual } from "lodash";

export const DEFAULT_SEED = 0.45;

const seededRandom = (seed) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export default function shuffle({ array, seed, notOriginalOrder = false}) {
  const initialArr = [...array]
  const arrLength = initialArr.length

  // Utilises the Durstenfeld shuffle, an optimized version of Fisher-Yates algorithm
  for (let i = arrLength - 1; i > 0; i--) {
    const r = seed ? seededRandom(seed + i) : Math.random();

    const j = Math.floor(r * (i + 1));
    [initialArr[i], initialArr[j]] = [initialArr[j], initialArr[i]];
  }

  const orderNotChanged = notOriginalOrder && isEqual(initialArr, array) && arrLength > 1;
  const nextSeed = seed ? DEFAULT_SEED : null // Default seed ensures order changes on next recursion

  return orderNotChanged ? shuffle({ array, seed: nextSeed, notOriginalOrder }) : initialArr;
}
