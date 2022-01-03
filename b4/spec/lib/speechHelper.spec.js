import { isAnalyzerLibRecognizerSupported, trainersContainSpeakInteraction } from '../../src/lib/speechHelper';
import * as Engines from '../../src/services/speechRecognition/engines';

describe('speechHelper', () => {
  describe('#isAnalyzerLibRecognizerSupported', () => {
    test('checks all features are present', () => {
      const contextObj = {
        aString: 'hei',
        aFunction: {
          foo: {
            bar: function() {}
          }
        }
      };
      const data = [
        { path: 'aString', type: 'string', context: function() { return contextObj; } },
        { path: 'aFunction.foo.bar', type: 'function', context: function() { return contextObj; } }
      ];
      expect(isAnalyzerLibRecognizerSupported(data)).toBe(true);
    });
  });
  describe('#trainersContainSpeakInteraction', () => {
    describe('when a supported speaking trainer is present', () => {
      test('returns true', () => {
        const webSpeechTrainers = [
          { type: 'dialog', interaction: 'speak' }
        ];
        expect(trainersContainSpeakInteraction(webSpeechTrainers, Engines.types.WEB_SPEECH)).toBeTruthy();

        const nativeTrainers = [
          { type: 'dialog', interaction: 'speak' }
        ];
        expect(trainersContainSpeakInteraction(nativeTrainers, Engines.types.NATIVE_SPEECH)).toBeTruthy();

        const legacyTrainers = [
          { type: 'vocabulary', interaction: 'speak' }
        ];
        expect(trainersContainSpeakInteraction(legacyTrainers, Engines.types.LEGACY_SPEECH)).toBeTruthy();

        const mixedTrainers = [
          { type: 'vocabulary', interaction: 'speak' },
          { type: 'dialog', interaction: 'speak' }
        ];
        expect(trainersContainSpeakInteraction(mixedTrainers, Engines.types.LEGACY_SPEECH)).toBeTruthy();
      });

      test('returns false', () => {
        const noSpeechTrainers = [
          { type: 'vocabulary', interaction: 'click' },
          { type: 'card', interaction: 'fillin' }
        ];
        expect(trainersContainSpeakInteraction(noSpeechTrainers, Engines.types.WEB_SPEECH)).toBeFalsy();

        const legacyTrainers = [
          { type: 'dialog', interaction: 'speak' }
        ];
        expect(trainersContainSpeakInteraction(legacyTrainers, Engines.types.LEGACY_SPEECH)).toBeFalsy();
      });
    });
  });
});
