import getBestMatch, { getBigrams, compareTwoStrings } from '../../../src/lib/matchingUtils/getBestMatch.js';

describe('getBigrams', () => {
  const feeBigrams = new Map([['_f', 1], ['fe', 1], ['ee', 1], ['e_', 1]]);
  const bananaBigrams = new Map([['_b', 1], ['ba', 1], ['an', 2], ['na', 2], ['a_', 1]]);
  const testData = [
    { string: 'fee', expected: feeBigrams },
    { string: 'banana', expected: bananaBigrams }
  ];

  test.each(testData)('returns the correct bigrams of a provided string', (td) => {
    expect(getBigrams(td.string)).toEqual(td.expected);
  });
});

describe('compareTwoStrings', () => {
  it('is a function', () => {
    expect(typeof compareTwoStrings).toEqual('function');
  });

  test.each([
    { first: 'a', second: 'americano', expected: 0.5 },
    { first: 'f', second: 'americano', expected: 0 },
    { first: 'b', second: 'bank', expected: 0.5 }
  ])('returns the correct value when first string has length of 1', (td) => {
    expect(compareTwoStrings(td.first, td.second)).toBe(td.expected, td);
  });

  test.each([
    { first: 'ame', second: 'ape', expected: 0.5 },
    { first: 'far', second: 'fit', expected: 0.25 }
  ])('returns a positive value when strings share first letter', (td) => {
    expect(compareTwoStrings(td.first, td.second)).toBe(td.expected, td);
  });


  test.each([
    { first: 'french', second: 'quebec', expected: 0 },
    { first: 'france', second: 'france', expected: 1 },
    { first: 'fRaNce', second: 'france', expected: 1 },
    { first: 'kanye', second: 'Kanye', expected: 1 },
    { first: 'healed', second: 'sealed', expected: 0.7142857142857143 },
    { first: 'to day', second: 'today', expected: 0.7692307692307693 },
    { first: 'web applications', second: 'applications of the web', expected: 0.6341463414634146 },
      // eslint-disable-next-line max-len
    { first: 'this will have a typo somewhere', second: 'this will huve a typo somewhere', expected: 0.9375 },
      // eslint-disable-next-line max-len
    { first: 'Olive-green table for sale, in extremely good condition.', second: 'For sale: table in very good  condition, olive green in colour.', expected: 0.7 },
      // eslint-disable-next-line max-len
    { first: 'Olive-green table for sale, in extremely good condition.', second: 'For sale: green Subaru Impreza, 210,000 miles', expected: 0.3300970873786408 },
      // eslint-disable-next-line max-len
    { first: 'Olive-green table for sale, in extremely good condition.', second: 'Wanted: mountain bike with at least 21 gears.', expected: 0.1553398058252427 },
    { first: 'this has one extra word', second: 'this has one word', expected: 0.8571428571428571 },
    { first: 'a', second: 'a', expected: 1 },
    { first: 'a', second: 'b', expected: 0 },
    { first: '', second: '', expected: 1 },
    { first: 'a', second: '', expected: 0 },
    { first: '', second: 'a', expected: 0 },
    { first: 'apple event', second: 'apple    event', expected: 1 },
    { first: 'iphone', second: 'iphone x', expected: 0.75 },
    { first: 'npo', second: 'nop', expected: 0.25 }
  ])('returns the correct value for "$first" and "$second"', (td) => {
    expect(compareTwoStrings(td.first, td.second)).toBe(td.expected, td);
  });
});

describe('getBestMatch', () => {
  const badArgsErrorMsg = 'Bad arguments: First argument should be a string, second should be an array of strings';

  it('is a function', () => {
    expect(typeof getBestMatch).toBe('function');
  });

  it('accepts a string and an array of strings and returns an object', () => {
    const output = getBestMatch('one', ['two', 'three']);
    expect(typeof output).toBe('object');
  });

  it('throws a \'Bad arguments\' error if no arguments passed', () => {
    expect(() => {
      getBestMatch();
    }).toThrowError(badArgsErrorMsg);
  });

  it('throws a \'Bad arguments\' error if first argument is not a non-empty string', () => {
    expect(() => {
      getBestMatch('');
    }).toThrowError(badArgsErrorMsg);

    expect(() => {
      getBestMatch(8);
    }).toThrowError(badArgsErrorMsg);
  });

  it('throws a \'Bad arguments\' error if second argument is not an array with at least one element', () => {
    expect(() => {
      getBestMatch('hello', 'something');
    }).toThrowError(badArgsErrorMsg);

    expect(() => {
      getBestMatch('hello', []);
    }).toThrowError(badArgsErrorMsg);
  });

  it('throws a \'Bad arguments\' error if second argument is not an array of strings', () => {
    expect(() => {
      getBestMatch('hello', [2, 'something']);
    }).toThrowError(badArgsErrorMsg);
  });

  it('assigns a similarity rating to each string passed in the array', () => {
    const matches = getBestMatch('healed', ['mailed', 'edward', 'sealed', 'theatre']);

    expect(matches.ratings).toEqual([
      { text: 'mailed', rating: 0.42857142857142855 },
      { text: 'edward', rating: 0.2857142857142857 },
      { text: 'sealed', rating: 0.7142857142857143 },
      { text: 'theatre', rating: 0.26666666666666666 }
    ]);
  });

  it('returns the best match and its similarity rating', () => {
    const matches = getBestMatch('healed', ['mailed', 'edward', 'sealed', 'theatre']);

    expect(matches.text).toEqual('sealed');
    expect(matches.rating).toEqual(0.7142857142857143);
  });

  it('returns the correct best match and when the two target texts differ by a space', () => {
    const matches1 = getBestMatch('today', ['to day', 'today']);
    const matches2 = getBestMatch('to day', ['today', 'to day']);

    expect(matches1.text).toEqual('today');
    expect(matches2.text).toEqual('to day');
  });

  it('returns the index of best match from the target strings', () => {
    const matches = getBestMatch('healed', ['mailed', 'edward', 'sealed', 'theatre']);

    expect(matches.bestMatchIndex).toBe(2);
  });

  it('if target strings only contains one value, it always returns that value', () => {
    const bestMatch1 = 'string';
    const matches1 = getBestMatch('healed', [bestMatch1]);

    expect(matches1.text).toBe(bestMatch1);

    const bestMatch2 = 'a';
    const matches2 = getBestMatch('f', [bestMatch2]);
    expect(matches2.text).toBe(bestMatch2);
  });

  it('if target strings have same rating, best match is the longer target', () => {
    const bestMatch1 = 'american';
    const matches1 = getBestMatch('el', ['amy', bestMatch1, 'amazing']);

    expect(matches1.text).toBe(bestMatch1);
  });
});
