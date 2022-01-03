import levenshteinDistance from '../../../src/lib/matchingUtils/levenshteinDistance';

describe('levenshteinDistance', () => {
  it('should calculate edit distance between two strings', () => {
    expect(levenshteinDistance('', '').distance).toBe(0);
    expect(levenshteinDistance('a', '').distance).toBe(1);
    expect(levenshteinDistance('', 'a').distance).toBe(1);
    expect(levenshteinDistance('abc', '').distance).toBe(3);
    expect(levenshteinDistance('', 'abc').distance).toBe(3);

    // Should just add I to the beginning.
    expect(levenshteinDistance('islander', 'slander').distance).toBe(1);

    // Needs to substitute M by K, T by M and add an A to the end
    expect(levenshteinDistance('mart', 'karma').distance).toBe(3);

    // Substitute K by S, E by I and insert G at the end.
    expect(levenshteinDistance('kitten', 'sitting').distance).toBe(3);

    // Should add 4 letters FOOT at the beginning.
    expect(levenshteinDistance('ball', 'football').distance).toBe(4);

    // Should delete 4 letters FOOT at the beginning.
    expect(levenshteinDistance('football', 'foot').distance).toBe(4);

    // Needs to substitute the first 5 chars: INTEN by EXECU
    expect(levenshteinDistance('intention', 'execution').distance).toBe(5);
  });

  describe('Levenshtein operations', () => {
    it('should identify insertions', () => {
      expect(levenshteinDistance('', '').operations.length).toBe(0);
      let result = levenshteinDistance('a', '');
      expect(result.distance).toBe(1);
      expect(result.operations.length).toBe(1);
      expect(result.operations[0].type).toBe('insertion');
      expect(result.operations[0].position).toBe(0);
      expect(result.operations[0].character).toBe('a');
    });
    it('should identify deletions', () => {
      let result = levenshteinDistance('ac', 'abc');
      expect(result.distance).toBe(1);
      expect(result.operations.length).toBe(1);
      expect(result.operations[0].type).toBe('deletion');
      expect(result.operations[0].position).toBe(1);
      expect(result.operations[0].character).toBe('b');
    });
    it('should identify substitutions', () => {
      let result = levenshteinDistance('nice', 'nise');
      expect(result.distance).toBe(1);
      expect(result.operations.length).toBe(1);
      expect(result.operations[0].type).toBe('substitution');
      expect(result.operations[0].position).toBe(2);
      expect(result.operations[0].character).toBe('c');
    });
    it('should identify transpositions', () => {
      let result = levenshteinDistance('los', 'lso');
      expect(result.distance).toBe(1);
      expect(result.operations.length).toBe(1);
      expect(result.operations[0].type).toBe('transposition');
      expect(result.operations[0].position).toBe(1);
      expect(result.operations[0].character).toBe('s');
    });
    it('should identify mixed operations', () => {
      let result = levenshteinDistance('full', 'vul');
      expect(result.distance).toBe(2);
      expect(result.operations.length).toBe(2);
      expect(result.operations[0].type).toBe('insertion');
      expect(result.operations[0].position).toBe(2);
      expect(result.operations[0].character).toBe('l');
      expect(result.operations[1].type).toBe('substitution');
      expect(result.operations[1].position).toBe(0);
      expect(result.operations[1].character).toBe('f');
    });
  });

  describe('with custom indicator function', () => {
    it('should call function for each character comparison', () => {
      const getIndicator = jest.fn((a, b)=> a === b ? 1 : 0);
      levenshteinDistance('foo', 'bar', getIndicator);
      expect(getIndicator.mock.calls).toEqual([
        ['f', 'b'],
        ['f', 'a'],
        ['f', 'r'],
        ['o', 'b'],
        ['o', 'a'],
        ['o', 'b'],
        ['f', 'a'],
        ['o', 'r'],
        ['o', 'a'],
        ['f', 'r'],
        ['o', 'b'],
        ['o', 'a'],
        ['o', 'b'],
        ['o', 'a'],
        ['o', 'r'],
        ['o', 'a'],
        ['o', 'r'],
        ['o', 'r'], // the last 3 calls for walking back
        ['o', 'a'],
        ['f', 'b']
      ]);
    });
    it('should apply custom indicator value', () => {
      const customIndicators = [
        ['e', 'é', 0],
        ['a', 'á', 0]
      ];
      const getIndicator = (a, b) => {
        if (a === b) return 0;
        for (let i = 1; i <= customIndicators.length; i += 1) {
          const [replacement, substitution, cost] = customIndicators[i - 1];
          if (a === substitution && b === replacement) {
            return cost;
          }
        }
        return 1;
      };
      expect(levenshteinDistance('báé', 'bae').distance).toBe(2);
      let result = levenshteinDistance('báé', 'bae', getIndicator);
      expect(result.distance).toBe(0);
      expect(result.operations.length).toBe(2);
      expect(result.operations[0].type).toBe('substitution');
      expect(result.operations[0].position).toBe(2);
      expect(result.operations[0].character).toBe('é');
      expect(result.operations[1].type).toBe('substitution');
      expect(result.operations[1].position).toBe(1);
      expect(result.operations[1].character).toBe('á');
      result = levenshteinDistance('báé', 'baee', getIndicator);
      expect(result.distance).toBe(1);
      expect(result.operations.length).toBe(3);
      expect(result.operations[0].type).toBe('substitution');
      expect(result.operations[1].type).toBe('deletion');
      expect(result.operations[2].type).toBe('substitution');
      result = levenshteinDistance('báé', 'bea', getIndicator);
      expect(result.distance).toBe(1);
      expect(result.operations.length).toBe(1);
      expect(result.operations[0].type).toBe('transposition');
      expect(result.operations[0].position).toBe(1);
      expect(result.operations[0].character).toBe('e');
    });
  });
});
