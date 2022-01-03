import { BABBEL_ROOT_BRIDGE } from '../../../../../src/lib/nativeBridge';
import { NativeSpeechRecognitionService }
  from '../../../../../src/services/speechRecognition/engines/bridged';
import { setupMethodMock } from '../../../../lib/nativeBridgeTestHelpers';

jest.mock('../../../../../src/dux/tracker/events/speechRecognition', () => ({
  getLessonContext: jest.fn(() => 'lesson')
}));

describe('NativeSpeechRecognitionService bridge', () => {
  const name = 'speech';
  const engineName = 'BridgedSiriSpeechRecognition';
  const speech = 'window.babbelWeb.speech';
  let nativeSpeechRecognitionService;

  beforeEach(() => {
    delete window[BABBEL_ROOT_BRIDGE];
    nativeSpeechRecognitionService = new NativeSpeechRecognitionService();
  });

  describe('the bridge', () => {
    it(`has an engine name '${engineName}'`, () => {
      expect(nativeSpeechRecognitionService.getEngineName()).toEqual(engineName);
    });

    it('#isSupported(): returns a boolean (false in the test context)', () => {
      expect(nativeSpeechRecognitionService.isSupported()).toEqual(false);
    });
  });

  describe('the interface with native', () => {
    it(`is called '${name}'`, () => {
      expect(nativeSpeechRecognitionService.name).toEqual(name);
    });

    describe('methods that trigger the execution of native iOS code', () => {
      const getMessage = setupMethodMock();

      describe('web calls start()', () => {
        const params = {
          targetText: 'Bananaaa',
          soundId: '2938579436590',
          itemUuid: '1234item'
        };
        const expectedMessage = {
          type: 'speech/START',
          payload: {
            targetText: params.targetText,
            soundId: params.soundId,
            itemUuid: params.itemUuid,
            lessonContext: 'lesson'
          }
        };

        it('should post a message to native', () => {
          nativeSpeechRecognitionService.start(params);
          expect(getMessage()).toEqual(expectedMessage);
        });
      });

      describe('web calls stop()', () => {
        const expectedMessage = {
          type: 'speech/STOP',
          payload: {}
        };

        it('should post a message to native', () => {
          nativeSpeechRecognitionService.stop();
          expect(getMessage()).toEqual(expectedMessage);
        });
      });
    });

    describe('#cleanup', () => {
      it(`it should no longer execute an onStart callback in case native fires ${speech}.onStart`, () => {
        const onStart = jest.fn();
        nativeSpeechRecognitionService.start({ onStart });
        nativeSpeechRecognitionService.cleanup();
        window.babbelWeb.speech.onStart();
        expect(onStart).toHaveBeenCalledTimes(0);
      });

      it(`it should no longer execute an onSpeechStart callback in case native fires ${speech}.onSpeechStart`, () => {
        const onSpeechStart = jest.fn();
        nativeSpeechRecognitionService.start({ onSpeechStart });
        nativeSpeechRecognitionService.cleanup();
        window.babbelWeb.speech.onSpeechStart();
        expect(onSpeechStart).toHaveBeenCalledTimes(0);
      });

      it(`it should no longer execute an onResult callback in case native fires ${speech}.onResult`, () => {
        const onResult = jest.fn();
        nativeSpeechRecognitionService.start({ onResult });
        nativeSpeechRecognitionService.cleanup();
        const parameters = { isFinal: true, confidenceScore: 1, transcript: 'foo', solved: true };
        window.babbelWeb.speech.onResult(parameters);
        expect(onResult).toHaveBeenCalledTimes(0);
      });

      it(`it should no longer execute an onEnd callback in case native fires ${speech}.onEnd`, () => {
        const onEnd = jest.fn();
        nativeSpeechRecognitionService.start({ onEnd });
        nativeSpeechRecognitionService.cleanup();
        window.babbelWeb.speech.onEnd();
        expect(onEnd).toHaveBeenCalledTimes(0);
      });

      it(`it should no longer execute an onError callback in case native fires ${speech}.onError`, () => {
        const onError = jest.fn();
        nativeSpeechRecognitionService.start({ onError });
        nativeSpeechRecognitionService.cleanup();
        window.babbelWeb.speech.onError();
        expect(onError).toHaveBeenCalledTimes(0);
      });
    });

    describe('messages from the native iOS application to the lesson-player', () => {
      const expectedBridgeEvents = [
        'onStart',
        'onSpeechStart',
        'onResult',
        'onError',
        'onEnd'
      ];

      it('supports the a couple of events from native', () => {
        const events = nativeSpeechRecognitionService.events;
        expect(events).toEqual(expectedBridgeEvents);
      });

      describe(`when native calls ${speech}.onStart`, () => {
        const onStart = jest.fn();
        it('.onStart() should have been called once', () => {
          nativeSpeechRecognitionService.start({ onStart });
          window.babbelWeb.speech.onStart();
          expect(onStart).toHaveBeenCalledTimes(1);
        });
      });

      describe(`when native calls ${speech}.onSpeechStart`, () => {
        const onSpeechStart = jest.fn();
        it('.onSpeechStart() should have been called once', () => {
          nativeSpeechRecognitionService.start({ onSpeechStart });
          window.babbelWeb.speech.onSpeechStart();
          expect(onSpeechStart).toHaveBeenCalledTimes(1);
        });
      });

      describe(`when native calls ${speech}.onResult`, () => {
        const onResult = jest.fn();
        it('.onResult() should have been called once and with parameters', () => {
          nativeSpeechRecognitionService.start({ onResult });
          const parameters = { isFinal: true, confidenceScore: 1, transcript: 'foo', solved: true };
          window.babbelWeb.speech.onResult(parameters);
          expect(onResult).toHaveBeenCalledTimes(1);
          expect(onResult).toHaveBeenCalledWith(parameters);
        });
      });

      describe(`when native calls ${speech}.onEnd`, () => {
        const onEnd = jest.fn();
        it('.onEnd() should have been called once', () => {
          nativeSpeechRecognitionService.start({ onEnd });
          window.babbelWeb.speech.onEnd();
          expect(onEnd).toHaveBeenCalledTimes(1);
        });
      });

      describe(`when native calls ${speech}.onError`, () => {
        const onError = jest.fn();
        it('.onError() should have been called once', () => {
          nativeSpeechRecognitionService.start({ onError });
          window.babbelWeb.speech.onError();
          expect(onError).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
