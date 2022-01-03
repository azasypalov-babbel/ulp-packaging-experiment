const identical = (a, b) => a === b ? 0 : 1;

const getOperations = (a, b, getIndicator, distanceMatrix) => {
  // walk back through matrix to figure out path
  const operations = [];
  for (let i = a.length, j = b.length; i != 0 || j != 0;) {
    let indicator = 1;
    if (i > 0 && j > 0) {
      indicator = getIndicator(a[i - 1], b[j - 1]);
    }
    if ((i > 0 && j > 0) && distanceMatrix[i][j] == distanceMatrix[i - 1][j - 1] + indicator) {
      // substitution
      if (a.charAt(i - 1) != b.charAt(j - 1)) {
        operations.push({ type: 'substitution', position: j - 1, character: a.charAt(i - 1) });
      }
      i -= 1;
      j -= 1;
    } else if (i > 0 && (distanceMatrix[i][j] == distanceMatrix[i - 1][j] + 1)) {
      // insertion
      operations.push({ type: 'insertion', position: j, character: a.charAt(i - 1) });
      i -= 1;
    } else if (j > 0 && (distanceMatrix[i][j] == distanceMatrix[i][j - 1] + 1)) {
      // deletion
      operations.push({ type: 'deletion', position: j - 1, character: b.charAt(j - 1) });
      j -= 1;
    } else if (i > 1 && j > 1 && (distanceMatrix[i][j] == distanceMatrix[i - 2][j - 2] + 1)) {
      // transposition
      operations.push({ type: 'transposition', position: j - 2, character: b.charAt(j - 2) });
      i -= 2;
      j -= 2;
    }
  }
  return operations;
};

/**
 * original source code from trekhleb/javascript-algorithms
 * https://github.com/trekhleb/javascript-algorithms/tree/master/src/algorithms/string/levenshtein-distance
 */
export default function levenshteinDistance(a, b, getIndicator = identical) {
  // Create edit distance matrix for all possible modifications of
  // substrings of a to substrings of b.
  const distanceMatrix = Array(a.length + 1).fill(null).map(() => Array(b.length + 1).fill(null));
  for (let j = 0; j <= b.length; j += 1) {
    distanceMatrix[0][j] = j;
  }
  for (let i = 1; i <= a.length; i += 1) {
    distanceMatrix[i][0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const indicator = getIndicator(a[i - 1], b[j - 1]);
      distanceMatrix[i][j] = Math.min(
        distanceMatrix[i][j - 1] + 1, // deletion
        distanceMatrix[i - 1][j] + 1, // insertion
        distanceMatrix[i - 1][j - 1] + indicator, // substitution
      );
      if (i > 1 && j > 1 && getIndicator(a[i - 1], b[j - 2]) == 0 && getIndicator(a[i - 2], b[j - 1]) == 0) {
        distanceMatrix[i][j] = Math.min(
          distanceMatrix[i][j],
          distanceMatrix[i - 2][j - 2] + 1
        ); // transposition
      }
    }
  }
  return { distance: distanceMatrix[a.length][b.length],
    operations: getOperations(a, b, getIndicator, distanceMatrix) };
}
