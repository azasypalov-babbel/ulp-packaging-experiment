// returns a Map of bigrams (2 adjacent elements) for a string
export const getBigrams = (string) => {
  let bigrams = new Map();
  for (let i = 0; i < string.length; i += 1) {
    if (i === string.length - 1) {
      bigrams.set(`${string[i]}_`, 1);
      break;
    }

    if (i === 0) bigrams.set(`_${string[0]}`, 1);
    const bigram = string.substring(i, i + 2);
    const count = bigrams.has(bigram)
      ? bigrams.get(bigram) + 1
      : 1;

    bigrams.set(bigram, count);
  }
  return bigrams;
};

// Based on the Dice coefficient. Returns value (0-1) by comparing the no. of identical character pairs between strings.
// To recognise first/last letter matches, the no. of bigrams is extended e.g. "aim" => ['_a', 'ai', 'ie', 'e_]
export const compareTwoStrings = (string1, string2) => {
  const first = string1.replace(/\s+/g, ' ').trim().toLowerCase(); // removes extra space around and between words
  const second = string2.replace(/\s+/g, ' ').trim().toLowerCase();

  if (first === second) return 1; // identical or empty

  if (first.length < 1 || second.length < 2) return 0; // if first is a 0-letter and second is 0 or 1-letter string
  if (first.length === 1) return first === second[0] ? 0.5 : 0;

  const firstBigrams = getBigrams(first);

  let intersectionSize = 0;
  for (let i = 0; i < second.length; i += 1) {
    if (i === 0) {
      const firstLetterBigram = `_${second[0]}`;
      if (firstBigrams.has(firstLetterBigram)) {
        firstBigrams.set(firstLetterBigram, 0);
        intersectionSize += 1;
      }
    }

    const bigram = i === second.length - 1 ? `${second[i]}_` : second.substring(i, i + 2);
    const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) : 0;

    if (count > 0) {
      firstBigrams.set(bigram, count - 1);
      intersectionSize += 1;
    }
  }

  return (2.0 * intersectionSize) / ((first.length + second.length + 2));
};

const areArgsValid = (mainString, targetStrings) => {
  if (typeof mainString !== 'string') return false;
  if (!Array.isArray(targetStrings)) return false;
  if (!targetStrings.length) return false;
  if (targetStrings.find(function(s) { return typeof s !== 'string'; })) return false;
  return true;
};

export default (mainString, targetStrings) => {
  // eslint-disable-next-line max-len
  if (!areArgsValid(mainString, targetStrings)) throw new Error('Bad arguments: First argument should be a string, second should be an array of strings');
  const ratings = [];
  let bestMatchIndex = 0;

  for (let i = 0; i < targetStrings.length; i += 1) {
    const currentTargetString = targetStrings[i];
    const currentRating = compareTwoStrings(mainString, currentTargetString);
    ratings.push({ text: currentTargetString, rating: currentRating });
    const currentBestMatch = ratings[bestMatchIndex];
    const equalRatingCurrentTargetLonger =
      currentRating === currentBestMatch.rating && currentTargetString.length > currentBestMatch.text.length;

    if (currentRating > currentBestMatch.rating || equalRatingCurrentTargetLonger) {
      bestMatchIndex = i;
    }
  }


  const bestMatch = ratings[bestMatchIndex];
  return { ratings: ratings, bestMatchIndex: bestMatchIndex, ...bestMatch };
};
