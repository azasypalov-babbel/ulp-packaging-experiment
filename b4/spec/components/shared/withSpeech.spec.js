import React from 'react';
import { shallow } from 'enzyme';
import { withSpeech } from '../../../src/components/shared/withSpeech';

const Component = () => <div />;
const WrappedComponent = withSpeech(Component);

const getUserMediaMock = jest.fn(() => Promise.resolve());

const speechRecognitionServiceMock = {
  start: jest.fn((options) => {
    Object.keys(options).forEach((prop) => {
      speechRecognitionServiceMock[prop] = options[prop];
    });
  }),
  stop: jest.fn(),
  cleanup: jest.fn(),
  getEngineName: jest.fn(() => 'WebAPISpeechRecognition')
};

const defaultProps = {
  speechRecognitionService: speechRecognitionServiceMock,
  requestMicPermissions: jest.fn(),
  permissionsGranted: true,
  locale: 'en',
  learnLanguageAlpha3: 'FRA'
};

describe('withSpeech HOC', () => {
  Object.defineProperty(global.navigator, 'mediaDevices', {
    value: {
      getUserMedia: getUserMediaMock
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
    global.AudioContext = jest.fn(() => ({ createMediaStreamSource: jest.fn() }));
  });

  test('passes speech prop to child component', () => {
    const wrapper = shallow(<WrappedComponent {...defaultProps} />);
    expect(wrapper.props().speech).toMatchSnapshot();
  });

  test('permissions are requested on mount', () => {
    shallow(<WrappedComponent {...defaultProps} />);
    expect(defaultProps.requestMicPermissions).toHaveBeenCalled();
  });

  describe('child calls start prop', () => {
    test('should start speech recognition service', () => {
      expect.assertions(1);

      const wrapper = shallow(<WrappedComponent {...defaultProps} />);
      const { speech } = wrapper.first().props();
      speech.start();
      expect(speechRecognitionServiceMock.start).toHaveBeenCalledWith(
        expect.objectContaining({
          locale: 'en',
          learnLanguageAlpha3: 'FRA'
        })
      );
    });

    test('should handle onStart event by making listening flag true', () => {
      const wrapper = shallow(<WrappedComponent {...defaultProps} />);
      const { speech } = wrapper.first().props();
      expect.assertions(2);
      expect(wrapper.state('listening')).toEqual(false);
      speech.start();
      speechRecognitionServiceMock.onStart();
      expect(wrapper.state('listening')).toEqual(true);
    });
  });

  describe('no-speech error', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = shallow(<WrappedComponent {...defaultProps} />);
      const { speech } = wrapper.first().props();
      speech.start();
      speechRecognitionServiceMock.onStart();
      speechRecognitionServiceMock.onError({ error: 'no-speech' });
      speechRecognitionServiceMock.onEnd();
    });

    test('store error in state', () => {
      expect(wrapper.state('error')).toEqual('no-speech');
    });
  });

  describe('on speech end event', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = shallow(<WrappedComponent {...defaultProps} />);
      const { speech } = wrapper.first().props();
      speech.start();
      speechRecognitionServiceMock.onStart();
      speechRecognitionServiceMock.onEnd();
    });

    test('should set ended state and reset listening & recording flags', () => {
      expect(wrapper.state('ended')).toEqual(true);
      expect(wrapper.state('listening')).toEqual(false);
      expect(wrapper.state('recording')).toEqual(false);
    });
  });

  describe('speech with final result', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = shallow(<WrappedComponent {...defaultProps} />);
      const { speech } = wrapper.first().props();
      speech.start();
      speechRecognitionServiceMock.onStart();
    });

    test('transcript is updated in state', () => {
      speechRecognitionServiceMock.onResult({
        confidenceScore: 0.8,
        isFinal: false,
        transcript: 'die'
      });
      expect(wrapper.state('transcript')).toEqual('die');
      expect(wrapper.state('ended')).toEqual(false);

      speechRecognitionServiceMock.onResult({
        confidenceScore: 0.8,
        isFinal: false,
        transcript: 'die Stadt'
      });
      expect(wrapper.state('transcript')).toEqual('die Stadt');

      speechRecognitionServiceMock.onResult({
        confidenceScore: 0.8,
        isFinal: true,
        transcript: 'die Stadt'
      });

      expect(wrapper.state('ended')).toEqual(true);

      speechRecognitionServiceMock.onEnd();

      expect(wrapper.state('transcript')).toEqual('die Stadt');
      expect(wrapper.state('ended')).toEqual(true);
    });
  });

  describe('mute detection', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = shallow(<WrappedComponent {...defaultProps} />);
      const { speech } = wrapper.first().props();
      speech.start();
      speechRecognitionServiceMock.onStart();
    });
    describe('when mic is muted', () => {
      test('error MIC_MUTED is set into state', () => {
        speechRecognitionServiceMock.onMuteChange({
          target: { muted: true }
        });
        expect(wrapper.state('error')).toEqual('mic-muted');
      });
    });

    describe('when mic is unmuted', () => {
      test('should clear out error', () => {
        speechRecognitionServiceMock.onMuteChange({
          target: { muted: false }
        });
        expect(wrapper.state('error')).toEqual('');
      });
    });
  });

  describe('speech without final result', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = shallow(<WrappedComponent {...defaultProps} />);
      const { speech } = wrapper.first().props();
      speech.start();
      speechRecognitionServiceMock.onStart();
    });

    test('updates transcript in state', () => {
      speechRecognitionServiceMock.onResult({
        confidenceScore: 0.8,
        isFinal: false,
        transcript: 'die'
      });
      expect(wrapper.state('ended')).toEqual(false);

      speechRecognitionServiceMock.onEnd();

      expect(wrapper.state('transcript')).toEqual('die');
      expect(wrapper.state('ended')).toEqual(true);
    });
  });

  describe('Automatic speech timeout', () => {
    describe('when engine is WebAPISpeechRecognition', () => {
      let wrapper;
      beforeEach(() => {
        speechRecognitionServiceMock.getEngineName.mockImplementationOnce(() => 'WebAPISpeechRecognition');
        wrapper = shallow(<WrappedComponent {...defaultProps} />);
        const { speech } = wrapper.first().props();
        speech.start({
          targetText: 'Ich bin Sandra'
        });
      });

      test('Timeout is extended when result comes from speech recognition', () => {
        global.setTimeout = jest.fn();

        speechRecognitionServiceMock.onResult({
          confidenceScore: 0.8,
          isFinal: true,
          transcript: 'die'
        });

        const { speech } = wrapper.first().props();

        expect(global.setTimeout).toHaveBeenCalledWith(
          speech.stop,
          1000
        );
      });
    });

    describe('when engine is not WebAPISpeechRecognition', () => {
      let wrapper;
      beforeEach(() => {
        speechRecognitionServiceMock.getEngineName.mockImplementationOnce(() => 'OtherSpeechRecognition');
        wrapper = shallow(<WrappedComponent {...defaultProps} />);
        const { speech } = wrapper.first().props();
        speech.start({
          targetText: 'Ich bin Sandra'
        });
      });
      test('Timeout is never created', () => {
        global.setTimeout = jest.fn();

        speechRecognitionServiceMock.onResult({
          confidenceScore: 0.8,
          isFinal: true,
          transcript: 'die'
        });

        expect(global.setTimeout).not.toHaveBeenCalled();
      });
    });
  });

  describe('child calls stop prop', () => {
    test('it stops the speech recognition service', () => {
      expect.assertions(1);
      const wrapper = shallow(<WrappedComponent {...defaultProps} />);
      const { speech } = wrapper.first().props();
      speech.start();
      speech.stop();
      expect(speechRecognitionServiceMock.stop).toHaveBeenCalled();
    });
  });
});
