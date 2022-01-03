import { getTrackingNameForTrainerType } from '../../../src/dux/tracker/getTrackingNameForTrainerType';

describe('getTrackingNameForTrainerType', () => {
  describe('return tracking name for every trainer type', () => {
    describe('card', () => {
      test('interaction: write, puzzle_helper: false', () => {
        expect(getTrackingNameForTrainerType({
          type: 'card', interaction: 'write', puzzle_helper: false
        })).toEqual('Card_Fillin');
      });

      test('interaction: write, puzzle_helper: true', () => {
        expect(getTrackingNameForTrainerType({
          type: 'card', interaction: 'write', puzzle_helper: true
        })).toEqual('Card_Puzzlehelper');
      });

      test('interaction: choose', () => {
        expect(getTrackingNameForTrainerType({
          type: 'card', interaction: 'choose'
        })).toEqual('Card_Choicebuttons');
      });
    });

    describe('comprehension', () => {
      test('dictate: true', () => {
        expect(getTrackingNameForTrainerType({
          type: 'comprehension', dictate: true
        })).toEqual('Comprehension_Audio');
      });

      test('dictate: false', () => {
        expect(getTrackingNameForTrainerType({
          type: 'comprehension', dictate: false
        })).toEqual('Comprehension_Text');
      });
    });

    describe('dialog', () => {
      test('interaction: choose, dictate: false', () => {
        expect(getTrackingNameForTrainerType({
          type: 'dialog',
          interaction: 'choose',
          dictate: false
        })).toEqual('Dialog_Choicebuttons');
      });

      test('interaction: choose, dictate: true', () => {
        expect(getTrackingNameForTrainerType({
          type: 'dialog',
          interaction: 'choose',
          dictate: true
        })).toEqual('Dialog_DictateChoice');
      });

      test('interaction: write, dictate: true', () => {
        expect(getTrackingNameForTrainerType({
          type: 'dialog',
          interaction: 'write',
          dictate: true
        })).toEqual('Dialog_DictateFillin');
      });

      test('interaction: write, dictate: false', () => {
        expect(getTrackingNameForTrainerType({
          type: 'dialog',
          interaction: 'write',
          dictate: false
        })).toEqual('Dialog_Fillin');
      });

      test('interaction: write, dictate: false, puzzle_helper: true', () => {
        expect(getTrackingNameForTrainerType({
          type: 'dialog',
          interaction: 'write',
          dictate: false,
          puzzle_helper: true
        })).toEqual('Dialog_Puzzlehelper');
      });

      test('interaction: speak, mic: not enabled', () => {
        const isMicEnabled = false;
        expect(getTrackingNameForTrainerType(
          { type: 'dialog', interaction: 'speak' },
          isMicEnabled
        )).toEqual('Dialog_Show');
      });

      test('interaction: speak, mic: enabled', () => {
        const isMicEnabled = true;
        expect(getTrackingNameForTrainerType(
          { type: 'dialog', interaction: 'speak' },
          isMicEnabled
        )).toEqual('Dialog_Speak');
      });
    });

    test('dictate', () => {
      expect(getTrackingNameForTrainerType({
        type: 'dictate',
        dictate: true,
        interaction: 'choose'
      })).toEqual('Vocabulary_DictateChoice');
    });

    test('keyboard', () => {
      expect(getTrackingNameForTrainerType({
        type: 'keyboard'
      })).toEqual('Keyboard');
    });

    test('matching', () => {
      expect(getTrackingNameForTrainerType({
        type: 'matching'
      })).toEqual('Matching');
    });

    describe('vocabulary', () => {
      test('interaction: choose', () => {
        expect(getTrackingNameForTrainerType({
          type: 'vocabulary', interaction: 'choose'
        })).toEqual('Vocabulary_Choicebuttons');
      });

      test('interaction: click', () => {
        expect(getTrackingNameForTrainerType({
          type: 'vocabulary', interaction: 'click'
        })).toEqual('Vocabulary_Click');
      });

      test('interaction: speak, mic: not enabled', () => {
        const isMicEnabled = false;
        expect(getTrackingNameForTrainerType(
          { type: 'vocabulary', interaction: 'speak' },
          isMicEnabled
        )).toEqual('Vocabulary_Show');
      });

      test('interaction: speak, mic: enabled', () => {
        const isMicEnabled = true;
        expect(getTrackingNameForTrainerType(
          { type: 'vocabulary', interaction: 'speak' },
          isMicEnabled
        )).toEqual('Vocabulary_Speak');
      });

      test('interaction: show', () => {
        const isMicEnabled = true;
        expect(getTrackingNameForTrainerType(
          { type: 'vocabulary', interaction: 'show' },
          isMicEnabled
        )).toEqual('Vocabulary_Show');
      });

      test('interaction: wordorder', () => {
        expect(getTrackingNameForTrainerType({
          type: 'vocabulary', interaction: 'wordorder'
        })).toEqual('Vocabulary_Wordorder');
      });

      test('interaction: write, puzzle_helper: false', () => {
        expect(getTrackingNameForTrainerType({
          type: 'vocabulary', interaction: 'write', puzzle_helper: false
        })).toEqual('Vocabulary_Fillin');
      });

      test('interaction: write, puzzle_helper: true', () => {
        expect(getTrackingNameForTrainerType({
          type: 'vocabulary', interaction: 'write', puzzle_helper: true
        })).toEqual('Vocabulary_Puzzlehelper');
      });

      test('interaction: write, dictate: true', () => {
        expect(getTrackingNameForTrainerType({
          type: 'vocabulary', interaction: 'write', dictate: true
        })).toEqual('Vocabulary_DictateFillin');
      });
    });
  });
});
