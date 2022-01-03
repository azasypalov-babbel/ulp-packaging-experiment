import React from 'react';
import { withSpeechMessages } from '../../../src/components/shared/withSpeechMessages';
import { shallow } from 'enzyme';
import { CUSTOM_ERRORS, MEDIADEVICES_ERRORS } from '../../../src/components/shared/withSpeech';
import { MESSAGE_KEYS } from '../../../src/dux/messages/messageKeys';

describe('withSpeechMessages HOC', () => {
  const Component = () => <div/>;
  const WrappedComponent = withSpeechMessages(Component);

  describe('speech errors', () => {
    const defaultProps = {
      addMessage: jest.fn(),
      removeMessage: jest.fn(),
      speech: {
        ended: false,
        error: '',
        listening: false,
        recording: false,
        reset: jest.fn(),
        start: jest.fn(),
        transcript: '',
        permissionsGranted: true
      }
    };

    beforeEach(() => {
      defaultProps.addMessage.mockReset();
      defaultProps.removeMessage.mockReset();
    });

    describe('mic muted', () => {
      it('should add message', () => {
        const wrapper = shallow(<WrappedComponent {...defaultProps} />);

        const mockedProps = {
          ...defaultProps,
          speech: {
            ...defaultProps.speech,
            error: CUSTOM_ERRORS.MIC_MUTED
          }
        };

        wrapper.setProps(mockedProps);
        expect(defaultProps.addMessage).toHaveBeenCalledWith(MESSAGE_KEYS.MIC_MUTED);
      });

      it('should remove message', () => {
        const mockedProps = {
          ...defaultProps,
          speech: {
            ...defaultProps.speech,
            error: CUSTOM_ERRORS.MIC_MUTED
          }
        };

        const wrapper = shallow(<WrappedComponent {...mockedProps} />);
        wrapper.setProps(defaultProps);

        expect(defaultProps.removeMessage).toHaveBeenCalledWith(MESSAGE_KEYS.MIC_MUTED);
      });
    });

    describe('generic error', () => {
      it('should add message', () => {
        const wrapper = shallow(<WrappedComponent {...defaultProps} />);

        const mockedProps = {
          ...defaultProps,
          speech: {
            ...defaultProps.speech,
            error: CUSTOM_ERRORS.UNKNOWN_ERROR
          }
        };

        wrapper.setProps(mockedProps);
        expect(defaultProps.addMessage).toHaveBeenCalledWith(MESSAGE_KEYS.MIC_GENERIC);
      });

      it('should remove message', () => {
        const mockedProps = {
          ...defaultProps,
          speech: {
            ...defaultProps.speech,
            error: CUSTOM_ERRORS.UNKNOWN_ERROR
          }
        };

        const wrapper = shallow(<WrappedComponent {...mockedProps} />);
        wrapper.setProps(defaultProps);

        expect(defaultProps.removeMessage).toHaveBeenCalledWith(MESSAGE_KEYS.MIC_GENERIC);
      });
    });

    describe('not allowed error', () => {
      it('should add message', () => {
        const wrapper = shallow(<WrappedComponent {...defaultProps} />);

        const mockedProps = {
          ...defaultProps,
          speech: {
            ...defaultProps.speech,
            error: MEDIADEVICES_ERRORS.NOT_ALLOWED
          }
        };

        wrapper.setProps(mockedProps);
        expect(defaultProps.addMessage).toHaveBeenCalledWith(MESSAGE_KEYS.MIC_PERMISSIONS);
      });

      it('should remove message', () => {
        const mockedProps = {
          ...defaultProps,
          speech: {
            ...defaultProps.speech,
            error: MEDIADEVICES_ERRORS.NOT_ALLOWED
          }
        };

        const wrapper = shallow(<WrappedComponent {...mockedProps} />);
        wrapper.setProps(defaultProps);

        expect(defaultProps.removeMessage).toHaveBeenCalledWith(MESSAGE_KEYS.MIC_PERMISSIONS);
      });
    });
  });
});
