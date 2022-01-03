import {
  serialComma
} from '../../../../../src/components/Interactions/shared/Transliteration/TransliterationInstructions';

describe('Transliteration Instructions', () => {
  describe('serial comma', () => {
    it('should add commas between elements', () => {
      let list = ['1', '2', '3', '4'];
      expect(serialComma(list).join(''))
        .toEqual('1, 2, 3 and 4');
    });
  });
});
