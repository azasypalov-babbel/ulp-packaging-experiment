import { mapUsedTokens } from '../../../src/lib/matchingUtils/mapUsedTokens';

describe('map used tokens', () => {
  describe('mapping single words as tokens', () => {
    it('should keep same order as reference', () => {
      const inputText = 'Ich bin';
      const referenceTokens = ['Ich', 'bin', 'bin'];

      const result = mapUsedTokens({
        inputText,
        referenceTokens,
        order: [0, 2]
      });

      expect(result)
        .toEqual([{
          id: 0,
          token: 'Ich',
          used: true
        }, {
          id: 1,
          token: 'bin',
          used: false
        }, {
          id: 2,
          token: 'bin',
          used: true
        }]);
    });

    describe('when reference token contains special characters', () => {
      it('should mark a substitution as used', () => {
        const substitutionCosts = [
          { character: 'a', replacement: 'ä' },
          { character: 'ä', replacement: 'a' }
        ];
        const inputText = 'Hyane';
        const referenceTokens = ['Hyäne'];

        const result = mapUsedTokens({
          inputText,
          referenceTokens,
          substitutionCosts
        });
        expect(result)
          .toEqual([{
            id: 0,
            token: 'Hyäne',
            used: true
          }]);
      });
    });
  });

  describe('mapping multiple words as tokens', () => {
    it('should keep same order as reference', () => {
      const inputText = 'Ich bin';
      const referenceTokens = ['Ich bin', 'Ich komme'];

      const result = mapUsedTokens({
        inputText,
        referenceTokens,
        order: [0, 2]
      });

      expect(result)
        .toEqual([{
          id: 0,
          token: 'Ich bin',
          used: true
        }, {
          id: 1,
          token: 'Ich komme',
          used: false
        }]);
    });
  });

  describe('mapping individual characters as tokens', () => {
    it('should keep same order as reference', () => {
      const inputText = '';
      const referenceTokens = ['a', 'b', 'c', 'd', 'e'];

      const result = mapUsedTokens({
        inputText,
        referenceTokens
      });

      expect(result.map(({ token }) => token))
        .toEqual(['a', 'b', 'c', 'd', 'e']);
    });
    it('should mark used tokens', () => {
      const inputText = 'oi';
      const referenceTokens = ['i', 'h', 'o'];

      const result = mapUsedTokens({
        inputText,
        referenceTokens
      });

      expect(result.map(({ used }) => used))
        .toEqual([true, false, true]);
    });

    describe('when reference contains two of the same token', () => {
      describe('when only one of them is input', () => {
        it('should mark the first occurance as used', () => {
          const inputText = 'oi';
          const referenceTokens = ['i', 'h', 'o', 'i'];

          const result = mapUsedTokens({
            inputText,
            referenceTokens
          });
          expect(result.map(({ used }) => used))
            .toEqual([true, false, true, false]);
        });
      });

      describe('when both of them are input', () => {
        it('should mark both as used', () => {
          const inputText = 'ii';
          const referenceTokens = ['i', 'h', 'o', 'i'];

          const result = mapUsedTokens({
            inputText,
            referenceTokens
          });
          expect(result.map(({ used }) => used))
            .toEqual([true, false, false, true]);
        });
      });
    });

    describe('when reference special tokens', () => {
      it('should match them the same as normal tokens', () => {
        const inputText = 'Wh*\\t?';
        const referenceTokens = ['W', 'h', '*', '\\', 't', '?'];

        const result = mapUsedTokens({
          inputText,
          referenceTokens
        });
        expect(result.map(({ used }) => used))
          .toEqual([true, true, true, true, true, true]);
      });
    });

    describe('when reference contains special tokens', () => {
      it('should mark a substitution as used', () => {
        const substitutionCosts = [
          { character: 'a', replacement: 'ä' },
          { character: 'ä', replacement: 'a' }
        ];
        const inputText = 'Hya';
        const referenceTokens = ['H', 'y', 'ä', 'n', 'e'];

        const result = mapUsedTokens({
          inputText,
          referenceTokens,
          substitutionCosts
        });
        expect(result.map(({ used }) => used))
          .toEqual([true, true, true, false, false]);
      });
      it('should return original special token', () => {
        const inputText = 'Hya';
        const referenceTokens = ['H', 'y', 'ä', 'n', 'e'];

        const result = mapUsedTokens({
          inputText,
          referenceTokens
        });
        expect(result.map(({ token }) => token))
          .toEqual(['H', 'y', 'ä', 'n', 'e']);
      });

      it('should not mark more than one special token match', () => {
        const substitutionCosts = [
          { character: 'e', replacement: 'è' },
          { character: 'è', replacement: 'e' }
        ];
        const inputText = 'se le';
        const referenceTokens = ['s', 'e', ' ', 'l', 'è', 'v', 'e'];

        const result = mapUsedTokens({
          inputText,
          referenceTokens,
          substitutionCosts
        });
        expect(result.map(({ used }) => used))
          .toEqual([true, true, true, true, true, false, false]);
      });
    });

    describe('with order provided', () => {
      it('should prioritise order over targetText', () => {
        const inputText = 'iii';
        const referenceTokens = ['i', 'i', 'i', 'i', 'i', 'i', 'i'];
        const order = [6];

        const result = mapUsedTokens({
          inputText,
          referenceTokens,
          order
        });
        expect(result.map(({ used }) => used))
          .toEqual([true, true, false, false, false, false, true]);
      });

      it('should mark all as used if all tokens are entered', () => {
        const inputText = 'iiiiiii';
        const referenceTokens = ['i', 'i', 'i', 'i', 'i', 'i', 'i'];
        const order = [6, 4, 2, 0];

        const result = mapUsedTokens({
          inputText,
          referenceTokens,
          order
        });
        expect(result.map(({ used }) => used))
          .toEqual([true, true, true, true, true, true, true]);
      });
    });
  });
});
