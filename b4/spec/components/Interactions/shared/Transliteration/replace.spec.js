import { determineReplacement } from '../../../../../src/components/Interactions/shared/Transliteration/replace';
import {
  createTransliterationConfig
} from '../../../../../src/components/Interactions/shared/Transliteration/transliterationProvider';

const testTransliterationConfig = createTransliterationConfig({
  map: {
    а: 'a',
    я: 'ja',
    ё: 'jo',
    ж: 'zh',
    й: 'jj',
    к: 'k',
    à: 'a//',
    с: 's',
    ш: 'sh',
    щ: 'shh'
  }
});

describe('Transliteration replacement', () => {
  it('makes substitutions that exist in the config', () => {
    const [result] = determineReplacement('jj', testTransliterationConfig);
    expect(result).toBe('й');
  });

  it('considers previous substitutions already made', () => {
    // type s
    const [first] = determineReplacement('s', testTransliterationConfig);
    expect(first).toBe('с');

    // type sh
    const [second] = determineReplacement('сh', testTransliterationConfig);
    expect(second).toBe('ш');

    // type shh
    const [third] = determineReplacement('шh', testTransliterationConfig);
    expect(third).toBe('щ');
  });

  it('does not get confused with additional text', () => {
    const [result] = determineReplacement('abcjj', testTransliterationConfig);
    expect(result).toBe('й');
  });

  it('prioritises replacements with previous characters over single ones', () => {
    const [result] = determineReplacement('ja', testTransliterationConfig);
    expect(result).toBe('я');
  });

  it('supports replacements that are 3 characters long', () => {
    const [result] = determineReplacement('a//', testTransliterationConfig);
    expect(result).toBe('à');
  });

  it('provides the distance (how many characters were replaced)', () => {
    const [, firstDistance] = determineReplacement('abcdea//', testTransliterationConfig);
    expect(firstDistance).toBe(3);

    const [, secondDistance] = determineReplacement('ja', testTransliterationConfig);
    expect(secondDistance).toBe(2);
  });

  it('does not half match previous transformations', () => {
    const [result] = determineReplacement('йj', testTransliterationConfig);
    expect(result).toBe(undefined);
  });

  it('returns empty tuple when no match is determined', () => {
    const result = determineReplacement('q', testTransliterationConfig);
    expect(result).toEqual([undefined, undefined]);
  });
});
