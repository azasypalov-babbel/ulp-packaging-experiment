import {
  normalise,
  replaceMatches,
  stripDiacritics,
  replaceSpecialCharacters
} from '../../../src/lib/matchingUtils/normalise';


describe('transcriptNormalise', () => {
  describe('#normalise', () => {
    it('should make input string lowercase', () => {
      expect(normalise('Die Stadt')).toEqual('die stadt');
    });
    it('should not make input string lowercase for DEU', () => {
      expect(normalise('Die Stadt', 'DEU')).toEqual('Die Stadt');
    });

    describe('normalising punctuation', () => {
      it('should remove full stops', () => {
        expect(normalise('die stadt.')).toEqual('die stadt');
        expect(normalise('foo. bar.')).toEqual('foo bar');
      });
      it('should remove commas', () => {
        expect(normalise('die, stadt')).toEqual('die stadt');
        expect(normalise('die, stadt, straße')).toEqual('die stadt straße');
      });
      it('should remove exclamation marks', () => {
        expect(normalise('die stadt!')).toEqual('die stadt');
      });
      it('should remove question marks', () => {
        expect(normalise('¿die stadt?')).toEqual('die stadt');
      });
      it('should remove # and @', () => {
        expect(normalise('#baz @foo')).toEqual('baz foo');
      });
      it('should remove unicode ellipsis', () => {
        expect(normalise('foo…')).toEqual('foo');
      });
      it('should remove dash marks', () => {
        expect(normalise('dare - dai ‑ dia')).toEqual('dare dai dia');
      });
      it('should remove : and ;', () => {
        expect(normalise('foo: baz;')).toEqual('foo baz');
      });
      it('should remove spaces', () => {
        expect(normalise('   foo ')).toEqual('foo');
      });
      it('should remove parentheses with the content', () => {
        expect(normalise('sie (pl.) gehen')).toEqual('sie gehen');
      });
      it('should remove extra spaces', () => {
        expect(normalise('foo  bar')).toEqual('foo bar');
      });
      it('should remove slashes', () => {
        expect(normalise('Zusammengehörigkeit/')).toEqual('zusammengehörigkeit');
      });
    });
  });

  describe('#replaceMatches', () => {
    const lookupTableEntries = [
      {
        expression: '(^|[ "])1($| |-|[;:,!\\?\\."]($| ))',
        replacement: '$1eins$2'
      },
      {
        expression: '(^|[ "])2($| |-|[;:,!\\?\\."]($| ))',
        replacement: '$1zwei$2'
      },
      {
        expression: '(^|[ "-])YouTube($| |-|[;:,!\\?\\."]($| ))',
        replacement: '$1you too$2'
      }
    ];

    it('should replace matches from lookup table', () => {
      expect(
        replaceMatches('1 oder 2 apples', lookupTableEntries)
      ).toEqual('eins oder zwei apples');
    });

    it('should replace multiple of the same match', () => {
      expect(
        replaceMatches('1 gegen 1', lookupTableEntries)
      ).toEqual('eins gegen eins');
    });

    it('should not break if replacementPairs are not supplied', () => {
      expect(
        replaceMatches('1 gegen 1')
      ).toEqual('1 gegen 1');
    });

    describe('when input string is normalized', () => {
      it('should replace matches from lookup table', () => {
        expect(
          replaceMatches('youtube', lookupTableEntries)
        ).toEqual('you too');
      });
    });
  });
});

describe('stripping Diacritics', () => {
  it('should return the same string without diacritics', () => {
    expect(stripDiacritics('Crème Brulée')).toEqual('Creme Brulee');
    expect(stripDiacritics('Äpfel')).toEqual('Apfel');
  });
});

describe('replace special characters', () => {
  it('returns a replacement for non latin stardard chars input', () => {
    expect(replaceSpecialCharacters('æ')).toEqual('a');
    expect(replaceSpecialCharacters('ı')).toEqual('i');
    expect(replaceSpecialCharacters('ł')).toEqual('l');
    expect(replaceSpecialCharacters('ø')).toEqual('o');
    expect(replaceSpecialCharacters('œ')).toEqual('o');
  });

  it('returns the same character for latin standard input', () => {
    expect(replaceSpecialCharacters('a')).toEqual('a');
    expect(replaceSpecialCharacters('n')).toEqual('n');
    expect(replaceSpecialCharacters('z')).toEqual('z');
    expect(replaceSpecialCharacters(' ')).toEqual(' ');
    expect(replaceSpecialCharacters('-')).toEqual('-');
    expect(replaceSpecialCharacters(':')).toEqual(':');
  });
});
