import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import useSpeech, {
  getMessageKey,
  getSpeakableText,
  CUSTOM_ERRORS,
  MEDIADEVICES_ERRORS,
  SPEECHRECOGNITION_ERRORS,
  SPEECH_STATES,
  IDLE_TIMEOUT
} from '../../../../src/components/Interactions/Speak/useSpeech';
import { ServiceContext } from '../../../../src/components/shared/withServices';
import { act } from 'react-dom/test-utils';
import { useDispatch, useSelector } from 'react-redux';
import { PERMISSIONS_STATUS } from '../../../../src/services/permissions/constants';
import { MESSAGE_KEYS } from '../../../../src/dux/messages/messageKeys';
import { addMessage, removeMessage } from '../../../../src/dux/messages/actions';
import { STOP_REASON } from '../../../../src/services/speechRecognition/constants';
import { RESULTS } from '../../../../src/lib/matchingUtils/evaluate';
import mockSoundService from '../../../../src/services/soundService';
import mockSpeechRecognitionService from '../../../../src/services/speechRecognition/service';

jest.mock('../../../../src/services/soundService');
jest.mock('../../../../src/components/shared/hooks/useMounted', () => ({
  __esModule: true,
  useMounted: jest.fn(() => () => true)
}));

jest.mock('react-redux');

const Consumer = () => null;

const TestSpeech = ({ learnLanguageAlpha3, locale, options }) => {
  const [state, actions, context] = useSpeech({ learnLanguageAlpha3, locale }, options);
  return <Consumer state={state} actions={actions} context={context} />;
};

TestSpeech.propTypes = {
  learnLanguageAlpha3: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  options: PropTypes.object
};

const mockServiceContext = {
  speechRecognitionService: mockSpeechRecognitionService,
  soundService: mockSoundService
};

const defaultProps = {
  locale: 'en',
  learnLanguageAlpha3: 'FRA'
};

const mountTest = (props = {}, options) => {
  const wrapper = mount(
    <ServiceContext.Provider value={mockServiceContext}>
      <TestSpeech {...defaultProps} {...props} options={options} />
    </ServiceContext.Provider>
  );

  return wrapper;
};

const getTestComponent = (wrapper) =>
  wrapper.find(Consumer).props();

let item = {
  id: 'd84e14c70b75585d007f70c6cbfab585',
  type: 'phrase',
  displayLanguageText: null,
  learnLanguageText: '**Kani:** ((Ich bin Kani, die neue Entwicklerin im Hodwer-Team.))',
  infoText: '3. Das Howder-Team ist sehr wichtig.',
  image: null,
  sound: { id: 'd3572193477785b1bc030cdf61ec777c' },
  speakerRole: 'f1'
};

let mockStore = {
  permissions: {
    micPermission: PERMISSIONS_STATUS.granted
  }
};

let mockDispatch = jest.fn();

jest.useFakeTimers();

afterEach(() => jest.clearAllTimers());

describe('useSpeech hook', () => {
  beforeEach(() => {
    useSelector.mockImplementation((selector) => selector(mockStore));
    useDispatch.mockImplementation(() => mockDispatch);
  });

  describe('ui states', () => {
    it('should start in RESTING state', () => {
      const wrapper = mountTest();
      const { state } = getTestComponent(wrapper);
      expect(state).toEqual(SPEECH_STATES.RESTING);
    });

    it('should not start idle', () => {
      const wrapper = mountTest();
      const { context } = getTestComponent(wrapper);
      expect(context.idle).toBeFalsy();
    });

    it('should enter LISTENING state when speech recognition starts', () => {
      const wrapper = mountTest();
      const { actions } = getTestComponent(wrapper);
      act(() => {
        actions.start(item);
        const [options] = mockSpeechRecognitionService.start.mock.calls[0];
        options.onStart();
      });

      wrapper.update();

      const { state } = getTestComponent(wrapper);
      expect(state).toEqual(SPEECH_STATES.LISTENING);
    });

    it('should enter RECORDING state when speech recognition starts to detect speech', () => {
      const wrapper = mountTest();
      const { actions } = getTestComponent(wrapper);
      act(() => {
        actions.start(item);
        const [options] = mockSpeechRecognitionService.start.mock.calls[0];
        options.onSpeechStart();
      });

      wrapper.update();

      const { state } = getTestComponent(wrapper);
      expect(state).toEqual(SPEECH_STATES.RECORDING);
    });

    it('should enter ERROR state if speech recognition encounters a fatal error', async () => {
      const wrapper = mountTest();
      const { actions } = getTestComponent(wrapper);

      await act(() => {
        const promise = actions.start(item).catch(() => {});
        const [options] = mockSpeechRecognitionService.start.mock.calls[0];
        options.onError({ error: 'audio-capture' });
        return promise;
      });

      wrapper.update();

      const { state } = getTestComponent(wrapper);
      expect(state).toEqual(SPEECH_STATES.ERROR);
    });

    it('should return to RESTING state if speech recognition encounters a non-fatal error', async () => {
      const wrapper = mountTest();
      const { actions } = getTestComponent(wrapper);
      await act(() => {
        const promise = actions.start(item).catch(() => {});

        const [options] = mockSpeechRecognitionService.start.mock.calls[0];
        options.onError({ error: 'no-speech' });
        return promise;
      });

      wrapper.update();

      const { state } = getTestComponent(wrapper);
      expect(state).toEqual(SPEECH_STATES.RESTING);
    });

    describe('when state is not transitioning', () => {
      it('should become idle', () => {
        const wrapper = mountTest();

        act(() => jest.runAllTimers());
        wrapper.update();

        const { context } = getTestComponent(wrapper);
        expect(context.idle).toBeTruthy();
      });

      describe('when idle timer is disabled', () => {
        it('should never become idle', () => {
          const wrapper = mountTest({}, { idleTimerEnabled: false });

          act(() => jest.runAllTimers());
          wrapper.update();

          const { context } = getTestComponent(wrapper);
          expect(context.idle).not.toBeTruthy();
        });
      });
    });
  });

  describe('idle state', () => {
    it('should become idle after x seconds from RESTING', () => {
      const wrapper = mountTest();
      const { state, context } = getTestComponent(wrapper);
      expect(state).toEqual(SPEECH_STATES.RESTING);
      expect(context.idle).toBeFalsy();

      act(() => jest.runAllTimers());
      wrapper.update();

      const { context: newContext, state: newState } = getTestComponent(wrapper);
      expect(newState).toEqual(SPEECH_STATES.RESTING);
      expect(newContext.idle).toBeTruthy();
    });

    it('should go idle when in LISTENING state', () => {
      const wrapper = mountTest();
      const { actions } = getTestComponent(wrapper);

      act(() => {
        actions.start(item);
        const [options] = mockSpeechRecognitionService.start.mock.calls[0];
        options.onStart();
      });
      wrapper.update();

      const { context, state } = getTestComponent(wrapper);
      expect(state).toEqual(SPEECH_STATES.LISTENING);
      expect(context.idle).toBeFalsy();

      act(() => jest.runAllTimers());
      wrapper.update();

      const { context: newContext, state: newState } = getTestComponent(wrapper);
      expect(newState).toEqual(SPEECH_STATES.LISTENING);
      expect(newContext.idle).toBeTruthy();
    });

    it('should go idle when in RECORDING state', () => {
      const wrapper = mountTest();
      const { actions } = getTestComponent(wrapper);

      act(() => {
        actions.start(item);
        const [options] = mockSpeechRecognitionService.start.mock.calls[0];
        options.onSpeechStart();
      });
      wrapper.update();

      const { context, state } = getTestComponent(wrapper);
      expect(state).toEqual(SPEECH_STATES.RECORDING);
      expect(context.idle).toBeFalsy();

      act(() => jest.runAllTimers());
      wrapper.update();

      const { context: newContext, state: newState } = getTestComponent(wrapper);
      expect(newState).toEqual(SPEECH_STATES.RECORDING);
      expect(newContext.idle).toBeTruthy();
    });

    it('should not go idle when in ERROR state', async () => {
      const wrapper = mountTest();
      const { actions } = getTestComponent(wrapper);

      await act(() => {
        const promise = actions.start(item).catch(() => {});
        const [options] = mockSpeechRecognitionService.start.mock.calls[0];
        options.onError({ error: 'some error occurred' });
        return promise;
      });
      wrapper.update();

      const { context, state } = getTestComponent(wrapper);
      expect(state).toEqual(SPEECH_STATES.ERROR);
      expect(context.idle).toBeFalsy();

      act(() => jest.runAllTimers());
      wrapper.update();

      const { context: newContext, state: newState } = getTestComponent(wrapper);
      expect(newState).toEqual(SPEECH_STATES.ERROR);
      expect(newContext.idle).toBeFalsy();
    });

    describe('with push to talk enabled', () => {
      it('should not go idle when in LISTENING state', () => {
        const wrapper = mountTest();
        const { actions } = getTestComponent(wrapper);

        act(() => {
          actions.start(item, { pushToSpeak: true });
          const [options] = mockSpeechRecognitionService.start.mock.calls[0];
          options.onStart();
        });
        wrapper.update();

        const { context, state } = getTestComponent(wrapper);
        expect(state).toEqual(SPEECH_STATES.LISTENING);
        expect(context.idle).toBeFalsy();

        act(() => jest.runAllTimers());
        wrapper.update();

        const { context: newContext, state: newState } = getTestComponent(wrapper);
        expect(newState).toEqual(SPEECH_STATES.LISTENING);
        expect(newContext.idle).toBeFalsy();
      });

      it('should not go idle when in RECORDING state', () => {
        const wrapper = mountTest();
        const { actions } = getTestComponent(wrapper);

        act(() => {
          actions.start(item, { pushToSpeak: true });
          const [options] = mockSpeechRecognitionService.start.mock.calls[0];
          options.onSpeechStart();
        });
        wrapper.update();

        const { context, state } = getTestComponent(wrapper);
        expect(state).toEqual(SPEECH_STATES.RECORDING);
        expect(context.idle).toBeFalsy();

        act(() => jest.runAllTimers());
        wrapper.update();

        const { context: newContext, state: newState } = getTestComponent(wrapper);
        expect(newState).toEqual(SPEECH_STATES.RECORDING);
        expect(newContext.idle).toBeFalsy();
      });

      it('should not go idle when in ERROR state', async () => {
        const wrapper = mountTest();
        const { actions } = getTestComponent(wrapper);

        await act(() => {
          const promise = actions
            .start(item, { pushToSpeak: true })
            .catch(() => {});
          const [options] = mockSpeechRecognitionService.start.mock.calls[0];
          options.onError({
            error: 'some error occurred'
          });
          return promise;
        });
        wrapper.update();

        const { context, state } = getTestComponent(wrapper);
        expect(state).toEqual(SPEECH_STATES.ERROR);
        expect(context.idle).toBeFalsy();

        act(() => jest.runAllTimers());
        wrapper.update();

        const { context: newContext, state: newState } = getTestComponent(wrapper);
        expect(newState).toEqual(SPEECH_STATES.ERROR);
        expect(newContext.idle).toBeFalsy();
      });
    });
  });

  describe('start action', () => {
    it('should stop all sounds from playing before starting speech', () => {
      const wrapper = mountTest();
      const { actions } = getTestComponent(wrapper);

      act(() => { actions.start(item); });

      expect(mockServiceContext.soundService.stop).toHaveBeenCalled();
    });

    it('should start speech recognition', () => {
      const wrapper = mountTest();
      const { actions } = getTestComponent(wrapper);

      act(() => { actions.start(item); });

      expect(mockSpeechRecognitionService.start).toHaveBeenCalledWith(
        expect.objectContaining({
          lang: 'fr-FR',
          locale: 'en',
          targetText: 'Ich bin Kani, die neue Entwicklerin im Hodwer-Team.',
          soundId: 'd3572193477785b1bc030cdf61ec777c'
        })
      );
    });

    it('should reject if provided with a task item', async () => {
      const item = {
        id: 'ef8854774469235f1114461fa4d45264',
        type: 'task',
        displayLanguageText: 'This conversation shows how two people in the office meet for the first time.',
        learnLanguageText: 'Diese Unterhaltung zeigt, wie sich zwei Leute im Büro zum ersten Mal treffen.',
        infoText: 'Even a task can have an info_text - at least in dialog show',
        image: null,
        sound: null,
        speakerRole: null
      };
      const wrapper = mountTest();
      const { actions } = getTestComponent(wrapper);

      await act(() => {
        return expect(actions.start(item))
          .rejects
          .toEqual(new Error('Task items are not supported for speak interaction'));
      });
    });

    it('should reject if provided with an item without sound', async () => {
      const item = {
        id: 'd84e14c70b75585d007f70c6cbfab585',
        type: 'phrase',
        displayLanguageText: null,
        learnLanguageText: '**Kani:** ((Ich bin Kani, die neue Entwicklerin im Hodwer-Team.))',
        infoText: '3. Das Howder-Team ist sehr wichtig.',
        image: null,
        sound: null,
        speakerRole: 'f1'
      };
      const wrapper = mountTest();
      const { actions } = getTestComponent(wrapper);

      await act(() => {
        return expect(actions.start(item))
          .rejects
          .toEqual(new Error('Item must have a sound provided for speak interaction'));
      });
    });

    it('should resolve with an attempt on final result', async () => {
      const wrapper = mountTest();
      const { actions } = getTestComponent(wrapper);

      await act(() => {
        const promise = actions.start(item);

        const [options] = mockSpeechRecognitionService.start.mock.calls[0];
        options.onStart();
        options.onSpeechStart();
        options.onResult({
          solved: true,
          confidenceScore: 0.8,
          isFinal: true,
          transcript: 'die'
        });

        return expect(promise)
          .resolves
          .toEqual({
            // General attempt values
            feedbackType: RESULTS.CORRECT,
            text: 'Ich bin Kani, die neue Entwicklerin im Hodwer-Team.',
            inputText: 'die',
            solved: true
          });
      });
    });

    it('should reject on error', async () => {
      const wrapper = mountTest();
      const { actions } = getTestComponent(wrapper);

      await act(() => {
        const promise = actions.start(item);

        const [options] = mockSpeechRecognitionService.start.mock.calls[0];
        options.onError({ error: 'no-speech' });

        return expect(promise)
          .rejects
          .toEqual(new Error('no-speech'));
      });
    });

    it('should reject on end if there is no final result', async () => {
      const wrapper = mountTest();
      const { actions } = getTestComponent(wrapper);

      await act(() => {
        const promise = actions.start(item);

        const [options] = mockSpeechRecognitionService.start.mock.calls[0];
        options.onStart();
        options.onSpeechStart();
        options.onResult({
          solved: false,
          confidenceScore: 0.8,
          isFinal: false,
          transcript: 'die'
        });
        options.onEnd();

        return expect(promise)
          .rejects
          .toEqual(new Error('aborted'));
      });
    });

    describe('when receiving a transcript', () => {
      it('should leave idle state', () => {
        const wrapper = mountTest();
        const { actions } = getTestComponent(wrapper);

        act(() => { actions.start(item); });
        act(() => jest.runAllTimers());
        wrapper.update();

        const { context: contextBeforeTranscript } = getTestComponent(wrapper);
        expect(contextBeforeTranscript.idle).toBeTruthy();

        act(() => {
          const [options] = mockSpeechRecognitionService.start.mock.calls[0];
          options.onStart();
          options.onSpeechStart();
          options.onResult({
            solved: false,
            confidenceScore: 0.8,
            isFinal: false,
            transcript: 'die'
          });
        });

        wrapper.update();
        const { context: contextAfterTranscript } = getTestComponent(wrapper);
        expect(contextAfterTranscript.idle).toBeFalsy();
      });

      it('should restart the idle timeout', () => {
        const TIME_TO_TIMEOUT = 100;

        const wrapper = mountTest();
        const { actions } = getTestComponent(wrapper);

        act(() => { actions.start(item); });
        act(() => jest.advanceTimersByTime(IDLE_TIMEOUT - TIME_TO_TIMEOUT));
        wrapper.update();

        const { context: contextBeforeTranscript } = getTestComponent(wrapper);
        expect(contextBeforeTranscript.idle).toBeFalsy();

        act(() => {
          const [options] = mockSpeechRecognitionService.start.mock.calls[0];
          options.onStart();
          options.onSpeechStart();
          options.onResult({
            solved: false,
            confidenceScore: 0.8,
            isFinal: false,
            transcript: 'die'
          });
          jest.advanceTimersByTime(TIME_TO_TIMEOUT + 1);
        });

        wrapper.update();
        const { context: contextAfterTranscript } = getTestComponent(wrapper);
        expect(contextAfterTranscript.idle).toBeFalsy();

        act(() => jest.advanceTimersByTime(IDLE_TIMEOUT));

        wrapper.update();
        const { context: contextAfterTimeout } = getTestComponent(wrapper);
        expect(contextAfterTimeout.idle).toBeTruthy();
      });

      it('should force finish speech recognition after a time of no additional results', () => {
        const wrapper = mountTest();
        const { actions } = getTestComponent(wrapper);

        act(() => {
          actions.start(item);
          const [options] = mockSpeechRecognitionService.start.mock.calls[0];
          options.onStart();
          options.onSpeechStart();
          options.onResult({
            solved: false,
            confidenceScore: 0.8,
            isFinal: false,
            transcript: 'die'
          });
        });

        // Wait for no speech detected timeout
        act(() => jest.runAllTimers());

        expect(mockSpeechRecognitionService.stop).toHaveBeenCalledWith(STOP_REASON.FINISH);
      });
    });

    describe('when receiving no transcript', () => {
      it('should stop speech recognition', () => {
        const wrapper = mountTest();
        const { actions } = getTestComponent(wrapper);

        act(() => {
          actions.start(item);
          const [options] = mockSpeechRecognitionService.start.mock.calls[0];
          options.onStart();
        });

        // Wait for no speech detected timeout
        act(() => jest.runAllTimers());

        expect(mockSpeechRecognitionService.stop).toHaveBeenCalledWith(STOP_REASON.CANCEL);
      });
    });
  });

  describe('stop action', () => {
    it('should stop speech recognition', () => {
      const wrapper = mountTest();
      const { actions } = getTestComponent(wrapper);

      actions.stop();

      expect(mockSpeechRecognitionService.stop).toHaveBeenCalled();
    });
  });

  describe('automatic timeout (default behaviour)', () => {
    it('should stop automatically after 1000ms of no results', () => {
      const wrapper = mountTest();
      const { actions } = getTestComponent(wrapper);

      act(() => {
        actions.start(item);
        const [options] = mockSpeechRecognitionService.start.mock.calls[0];
        options.onStart();
        options.onSpeechStart();
        options.onResult({
          solved: false,
          confidenceScore: 0.8,
          isFinal: false,
          transcript: 'die'
        });
      });

      act(() => jest.runAllTimers());

      expect(mockSpeechRecognitionService.stop).toHaveBeenCalled();
    });
  });

  describe('manual stop (push-to-speak behaviour)', () => {
    it('should not stop automatically', async () => {
      const wrapper = mountTest();
      const { actions } = getTestComponent(wrapper);

      act(() => {
        actions.start(item, { pushToSpeak: true });
        const [options] = mockSpeechRecognitionService.start.mock.calls[0];
        options.onStart();
        options.onSpeechStart();
      });

      act(() => {
        const [options] = mockSpeechRecognitionService.start.mock.calls[0];
        options.onResult({
          solved: false,
          confidenceScore: 0.8,
          isFinal: false,
          transcript: 'die'
        });
      });

      act(() => jest.runAllTimers());

      expect(mockSpeechRecognitionService.stop).not.toHaveBeenCalled();
    });
  });

  describe('speech context', () => {
    it('should contain information about mic permission', () => {
      const wrapper = mountTest();
      const { context } = getTestComponent(wrapper);
      expect(context.micPermission).toEqual('granted');
    });
  });

  describe('speech messages', () => {
    it('should not report errors that have no message', async () => {
      const wrapper = mountTest();
      const { actions } = getTestComponent(wrapper);
      mockDispatch.mockClear();
      await act(() => {
        const promise = actions.start(item).catch(() => {});
        const [options] = mockSpeechRecognitionService.start.mock.calls[0];
        options.onError({ error: 'aborted' });
        return promise;
      });
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('should report message to global state on error', async () => {
      const wrapper = mountTest();
      const { actions } = getTestComponent(wrapper);
      mockDispatch.mockClear();
      await act(() => {
        const promise = actions.start(item).catch(() => {});
        const [options] = mockSpeechRecognitionService.start.mock.calls[0];
        options.onError({ error: 'audio-capture' });
        return promise;
      });
      expect(mockDispatch)
        .toHaveBeenCalledWith(addMessage(MESSAGE_KEYS.MIC_GENERIC));
    });

    describe('mic muted', () => {
      it('should report and remove message from global state', async () => {
        const wrapper = mountTest();
        const { actions } = getTestComponent(wrapper);
        await act(() => {
          const promise = actions.start(item).catch(() => {});
          // Mic becomes muted
          const [options] = mockSpeechRecognitionService.start.mock.calls[0];
          options.onMuteChange({ target: { muted: true } });
          return promise;
        });

        // should report message to global state
        expect(mockDispatch)
          .toHaveBeenCalledWith(addMessage(MESSAGE_KEYS.MIC_MUTED));

        // Mic becomes unmuted
        act(() => {
          const [options] = mockSpeechRecognitionService.start.mock.calls[0];
          options.onMuteChange({ target: { muted: false } });
        });

        // should remove the message from global state
        expect(mockDispatch)
          .toHaveBeenCalledWith(removeMessage(MESSAGE_KEYS.MIC_MUTED));
      });
    });

    describe('error to message mapping', () => {
      it('should return the correct message given an error', () => {
        // generic message
        expect(getMessageKey(CUSTOM_ERRORS.UNKNOWN_ERROR)).toBe(MESSAGE_KEYS.MIC_GENERIC);
        expect(getMessageKey(SPEECHRECOGNITION_ERRORS.SERVICE_NOT_ALLOWED)).toBe(MESSAGE_KEYS.MIC_GENERIC);
        expect(getMessageKey(SPEECHRECOGNITION_ERRORS.NETWORK)).toBe(MESSAGE_KEYS.MIC_GENERIC);
        expect(getMessageKey(SPEECHRECOGNITION_ERRORS.AUDIO_CAPTURE)).toBe(MESSAGE_KEYS.MIC_GENERIC);
        expect(getMessageKey(SPEECHRECOGNITION_ERRORS.LANGUAGE_NOT_SUPPORTED)).toBe(MESSAGE_KEYS.MIC_GENERIC);
        expect(getMessageKey(SPEECHRECOGNITION_ERRORS.BAD_GRAMMAR)).toBe(MESSAGE_KEYS.MIC_GENERIC);
        // permissions message
        expect(getMessageKey(SPEECHRECOGNITION_ERRORS.NOT_ALLOWED)).toBe(MESSAGE_KEYS.MIC_PERMISSIONS);
        expect(getMessageKey(MEDIADEVICES_ERRORS.NOT_ALLOWED)).toBe(MESSAGE_KEYS.MIC_PERMISSIONS);
        // mic muted message
        expect(getMessageKey(CUSTOM_ERRORS.MIC_MUTED)).toBe(MESSAGE_KEYS.MIC_MUTED);
      });
    });
  });

  describe('extracting speakable text from item', () => {
    describe('items with gaps', () => {
      it('should extract first gap from learn language text form phrase item', () => {
        const item = {
          id: 'd84e14c70b75585d007f70c61bfab585',
          type: 'phrase',
          displayLanguageText: null,
          learnLanguageText: '**Kani:** ((Ja gerne! Bislang kenne ich eigentlich nur meinen Sitzplatz.))',
          infoText: '5. Man möchte auch gerne wissen, wo Toiletten sind, oder die Küche.',
          image: null,
          sound: { id: 'd3572193477785b1bc030cdf61ec777c' },
          speakerRole: 'f1'
        };
        expect(getSpeakableText(item))
          .toEqual('Ja gerne! Bislang kenne ich eigentlich nur meinen Sitzplatz.');
      });
    });

    describe('item with no gaps', () => {
      it('should use the learn language text directly for phrases', () => {
        const item = {
          id: '68e4625b2230773aa7e1407d5b816245',
          type: 'phrase',
          displayLanguageText: 'This woman is on edge',
          learnLanguageText: 'Diese Frau ist genervt',
          infoText: null,
          image: { id: 'cdd2e892b0ae208ad2af49a342e29c8c' },
          sound: { id: 'd3572193477785b1bc030cdf61ec777c' },
          speakerRole: 'f1'
        };
        expect(getSpeakableText(item))
          .toEqual('Diese Frau ist genervt');
      });
    });

    it('should throw error for task items', () => {
      const item = {
        id: 'ef8854774469235f1114461fa4d45264',
        type: 'task',
        displayLanguageText: 'This conversation shows how two people in the office meet for the first time.',
        learnLanguageText: 'Diese Unterhaltung zeigt, wie sich zwei Leute im Büro zum ersten Mal treffen.',
        infoText: 'Even a task can have an info_text - at least in dialog show',
        image: null,
        sound: null,
        speakerRole: null
      };
      expect(() => getSpeakableText(item))
        .toThrow(new Error('Task items are not supported for speak interaction'));
    });
  });
});
