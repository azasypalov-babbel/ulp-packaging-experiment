import * as catServices from '../../../../src/services/speechRecognition/substitutions/service.cat';
import * as speechRecognitionSubstitutionsServices
  from '../../../../src/services/speechRecognition/substitutions/service';

describe('CAT Speech Recognition Substitutions Service', () => {
  describe('#moduleExports', () => {
    test('it exports the same methods as the "regular" speech recognition substitutions service', () => {
      expect(Object.keys(catServices.default))
        .toEqual(Object.keys(speechRecognitionSubstitutionsServices.default));
    });
  });
});

