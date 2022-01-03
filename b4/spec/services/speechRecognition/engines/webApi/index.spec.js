import speechRecognitionService from '../../../../../src/services/speechRecognition/engines/webApi';
import speechRecognitionSubstitutionsService
  from '../../../../../src/services/speechRecognition/substitutions';
import speechInputAssessment from '../../../../../src/lib/speech/inputAssessment';
import { startMuteDetection } from '../../../../../src/services/speechRecognition/muteDetection';
import browserDetection from '../../../../../src/lib/browserDetection';

jest.mock('underscore', () => ({
  memoize: (f) => f
}));

jest.mock('../../../../../src/services/speechRecognition/muteDetection');
const cleanupMuteDetection = jest.fn();

jest.spyOn(speechInputAssessment, 'matches');
jest.spyOn(speechInputAssessment, 'createAssessmentForSpeechRecognitionResult');

jest.mock('../../../../../src/services/speechRecognition/substitutions');

jest.mock('../../../../../src/lib/browserDetection', () => ({
  isChrome: false
}));

const SpeechRecognitionAlternative = (transcript, isFinal, confidence) => {
  const alternative = [{ transcript, confidence }];
  alternative.isFinal = isFinal;
  return alternative;
};

describe('Speech Recognition Service', () => {
  let speechRecognitionInstance;
  beforeEach(() => {
    speechRecognitionInstance = {
      start: jest.fn(),
      stop: jest.fn()
    };
    global.SpeechRecognition = jest.fn(() => speechRecognitionInstance);

    startMuteDetection.mockImplementation(() => Promise.resolve(cleanupMuteDetection));
    jest.clearAllMocks();
  });

  describe('Starting speech recognition', () => {
    it('should create an instance of SpeechRecognition and start it', () => {
      speechRecognitionService.start();
      expect(global.SpeechRecognition).toHaveBeenCalled();
      expect(speechRecognitionInstance.start).toHaveBeenCalled();
    });

    describe('Start event from speech recognition', () => {
      it('should call onStart callback', () => {
        const onStartMock = jest.fn();
        speechRecognitionService.start({
          onStart: onStartMock
        });
        return speechRecognitionInstance.onstart().then(() => {
          expect(onStartMock).toHaveBeenCalled();
        });
      });

      it('should start mute detection', () => {
        const onMuteChangeMock = jest.fn();
        speechRecognitionService.start({
          onMuteChange: onMuteChangeMock
        });
        return speechRecognitionInstance.onstart().then(() => {
          expect(startMuteDetection).toHaveBeenCalledWith({
            onChange: onMuteChangeMock
          });
        });
      });

      describe('when mute detection cannot start', () => {
        const onErrorMock = jest.fn();
        const mockError = new Error('The operation was aborted.');
        beforeEach(() => {
          startMuteDetection.mockImplementationOnce(() => new Promise(() => {
            throw mockError;
          }));
          speechRecognitionService.start({
            onError: onErrorMock
          });
        });

        it('should call on error callback', () => {
          return speechRecognitionInstance.onstart().then(() => {
            expect(onErrorMock).toHaveBeenCalledWith(mockError);
          });
        });
      });

      it('should cleanup mute detection if it exists', () => {
        const onMuteChangeMock = jest.fn();
        speechRecognitionService.start({
          onMuteChange: onMuteChangeMock
        });
        speechRecognitionInstance.cleanupMuteDetection = jest.fn();
        const cleanupSpy = jest.spyOn(speechRecognitionInstance, 'cleanupMuteDetection');
        return speechRecognitionInstance.onstart().then(() => {
          expect(cleanupSpy).toHaveBeenCalled();
          expect(speechRecognitionInstance.cleanupMuteDetection).toEqual(cleanupMuteDetection);
        });
      });
    });

    describe('Speech start event from speech recognition', () => {
      it('should call onSpeechStart callback', () => {
        const onSpeechStartMock = jest.fn();
        speechRecognitionService.start({
          onSpeechStart: onSpeechStartMock
        });
        speechRecognitionInstance.onspeechstart();
        expect(onSpeechStartMock).toHaveBeenCalled();
      });
    });

    describe('Error start event from speech recognition', () => {
      it('should call onError callback', () => {
        const onErrorMock = jest.fn();
        speechRecognitionService.start({
          onError: onErrorMock
        });
        speechRecognitionInstance.onerror();
        expect(onErrorMock).toHaveBeenCalled();
      });
    });

    describe('End event from speech recognition', () => {
      it('should call onEnd callback', () => {
        const onEndMock = jest.fn();
        speechRecognitionService.start({
          onEnd: onEndMock
        });
        speechRecognitionInstance.onend();
        expect(onEndMock).toHaveBeenCalled();
      });
    });
  });
  describe('Stopping speech recognition', () => {
    it('should stop SpeechRecognition', () => {
      speechRecognitionService.start();
      speechRecognitionService.stop();
      expect(speechRecognitionInstance.stop).toHaveBeenCalled();
    });
  });
  describe('Cleaning up speech recognition', () => {
    it('should stop recognition and remove the instance', () => {
      speechRecognitionService.start();

      const stopSpy = jest.spyOn(speechRecognitionInstance, 'stop');

      speechRecognitionService.cleanup();

      expect(stopSpy).toHaveBeenCalled();
    });

    it('should clear callbacks', () => {
      const setonend = jest.fn();
      const setonresult = jest.fn();
      speechRecognitionService.start({
        onend: () => {},
        onresult: () => {}
      });

      Object.defineProperty(speechRecognitionInstance, 'onend', { set: setonend });
      Object.defineProperty(speechRecognitionInstance, 'onresult', { set: setonresult });

      speechRecognitionService.cleanup();

      expect(setonend).toHaveBeenCalled();
      expect(setonresult).toHaveBeenCalled();
    });

    it('should cleanup mute detection', () => {
      speechRecognitionService.start();
      return speechRecognitionInstance.onstart().then(() => {
        speechRecognitionService.cleanup();
        expect(speechRecognitionInstance.cleanupMuteDetection).toHaveBeenCalled();
      });
    });
  });

  describe('Result event from speech recognition', () => {
    const lookupTableEntries = [
      {
        expression: '(^|[ "-])WAN($| |-|[;:,!\\?\\."]($| ))',
        replacement: '$1Wide Area Network$2'
      }
    ];
    const characterSubstitutionCosts = [
      { character: 'y', cost: 0.1, replacement: 'e' }
    ];

    const startSpeechRecognition = () => new Promise((resolve) => {
      let results = [];

      speechRecognitionService.start({
        targetText: 'die Stadt',
        onResult: (result) => {
          results.push(result);
          if (results.length == 3) {
            resolve(results);
          }
        }
      });

      speechRecognitionInstance.onresult({
        results: [
          SpeechRecognitionAlternative('die', false, 0.8)
        ]
      });

      speechRecognitionInstance.onresult({
        results: [
          SpeechRecognitionAlternative('die', false, 0.8),
          SpeechRecognitionAlternative(' Stadt', false, 0.8)
        ]
      });

      speechRecognitionInstance.onresult({
        results: [
          SpeechRecognitionAlternative('die Stadt', true, 0.8)
        ]
      });
    });

    describe('when the speech recognition substitution files load successfully', () => {
      beforeEach(() => {
        speechRecognitionSubstitutionsService.fetchSubstitutions
          .mockReturnValue(Promise.resolve({ lookupTableEntries, characterSubstitutionCosts }));
      });
      it('should be mapped to generic interface', () => {
        return expect(startSpeechRecognition()).resolves.toEqual([
          {
            confidenceScore: 0.8,
            isFinal: false,
            transcript: 'die',
            solved: false
          },
          {
            confidenceScore: 0.8,
            isFinal: false,
            transcript: 'die Stadt',
            solved: true
          },
          {
            confidenceScore: 0.8,
            isFinal: true,
            transcript: 'die Stadt',
            solved: true
          }
        ]);
      });

      it('should pass the lookup table entries and substitution costs', () => {
        expect.assertions(1);
        return startSpeechRecognition().then(() => {
          expect(speechInputAssessment.createAssessmentForSpeechRecognitionResult)
            .toHaveBeenCalledWith('die Stadt', expect.any(Object), { lookupTableEntries, characterSubstitutionCosts });
        });
      });
    });
    describe('when the speech recognition substitution files fail to load successfully', () => {
      beforeEach(() => {
        speechRecognitionSubstitutionsService.fetchSubstitutions
          .mockReturnValue(Promise.reject('whoops there was a glitch!'));
      });
      it('should be mapped to generic interface', () => {
        return expect(startSpeechRecognition()).resolves.toEqual([
          {
            confidenceScore: 0.8,
            isFinal: false,
            transcript: 'die',
            solved: false
          },
          {
            confidenceScore: 0.8,
            isFinal: false,
            transcript: 'die Stadt',
            solved: true
          },
          {
            confidenceScore: 0.8,
            isFinal: true,
            transcript: 'die Stadt',
            solved: true
          }
        ]);
      });

      it('uses empty lookup table entries and character substitution costs', () => {
        expect.assertions(1);
        return startSpeechRecognition().then(() => {
          expect(speechInputAssessment.createAssessmentForSpeechRecognitionResult).toHaveBeenCalledWith(
            'die Stadt', expect.any(Object), { lookupTableEntries: [], characterSubstitutionCosts: [] }
          );
        });
      });
    });
  });
  describe('Getting engineName', () => {
    it('should return the correct engineName', () => {
      expect(speechRecognitionService.getEngineName()).toEqual(
        'WebAPISpeechRecognition'
      );
    });
  });
  describe('support', () => {
    it('should be falsy for non chrome users', () => {
      expect(speechRecognitionService.isSupported()).toBeFalsy();
    });

    it('should be truthy for non chrome users', () => {
      browserDetection.isChrome = true;
      expect(speechRecognitionService.isSupported()).toBeTruthy();
    });
  });
});
