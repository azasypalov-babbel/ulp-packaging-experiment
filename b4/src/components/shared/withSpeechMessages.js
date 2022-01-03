import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { recognitionHasError,
  speechPropTypes,
  CUSTOM_ERRORS,
  SPEECHRECOGNITION_ERRORS,
  MEDIADEVICES_ERRORS
} from './withSpeech';
import { getDisplayName } from '../getDisplayName';
import { addMessage, removeMessage } from '../../dux/messages/actions';
import { MESSAGE_KEYS } from '../../dux/messages/messageKeys';

const recognitionErrorIsGone = (prevSpeechProps, speechProps) => {
  const hadError = prevSpeechProps.error && prevSpeechProps.error.trim().length > 0;
  const hasOriginalErrorGone = prevSpeechProps.error != speechProps.error;

  return hadError && hasOriginalErrorGone;
};

const recognitionGenericError = (error) => [
  CUSTOM_ERRORS.UNKNOWN_ERROR,
  SPEECHRECOGNITION_ERRORS.SERVICE_NOT_ALLOWED,
  SPEECHRECOGNITION_ERRORS.NETWORK,
  SPEECHRECOGNITION_ERRORS.AUDIO_CAPTURE,
  SPEECHRECOGNITION_ERRORS.LANGUAGE_NOT_SUPPORTED,
  SPEECHRECOGNITION_ERRORS.BAD_GRAMMAR
].includes(error);

const getMessageKey = (error) => {
  const isNotAllowedError = [
    MEDIADEVICES_ERRORS.NOT_ALLOWED,
    SPEECHRECOGNITION_ERRORS.NOT_ALLOWED
  ].includes(error);
  const isMicMutedError = error === CUSTOM_ERRORS.MIC_MUTED;
  const isGenericError = recognitionGenericError(error);

  let errorKey = null;
  if (isGenericError) {
    errorKey = MESSAGE_KEYS.MIC_GENERIC;
  } else if (isMicMutedError) {
    errorKey = MESSAGE_KEYS.MIC_MUTED;
  } else if (isNotAllowedError) {
    errorKey = MESSAGE_KEYS.MIC_PERMISSIONS;
  }

  return errorKey;
};

/**
 * @deprecated in favour of `useSpeech`.
 */
export const withSpeechMessages = (WrappedComponent) => {
  class WithSpeechMessages extends React.Component {
    constructor(props) {
      super(props);

      this.handleRemoveErrorMessage = this.handleRemoveErrorMessage.bind(this);
      this.handleDispatchErrorMessage = this.handleDispatchErrorMessage.bind(this);
    }

    componentDidUpdate(prevProps) {
      const { speech: prevSpeech } = prevProps;
      const { speech } = this.props;

      const hasSpeechError = recognitionHasError(prevSpeech, speech);
      if (hasSpeechError) this.handleDispatchErrorMessage(speech.error);

      const isSpeechErrorGone = recognitionErrorIsGone(prevSpeech, speech);
      if (isSpeechErrorGone) this.handleRemoveErrorMessage(prevSpeech.error);
    }

    handleRemoveErrorMessage(error) {
      const errorKey = getMessageKey(error);
      errorKey && this.props.removeMessage(errorKey);
    }

    handleDispatchErrorMessage(error) {
      const errorKey = getMessageKey(error);
      errorKey && this.props.addMessage(errorKey);
    }

    render() {
      return (
        <WrappedComponent {...this.props} />
      );
    }
  }

  WithSpeechMessages.displayName = `WithSpeechMessages(${getDisplayName(WrappedComponent)})`;

  WithSpeechMessages.propTypes = {
    speech: speechPropTypes,
    addMessage: PropTypes.func.isRequired,
    removeMessage: PropTypes.func.isRequired
  };

  return WithSpeechMessages;
};

const mapDispatchToProps = {
  addMessage,
  removeMessage
};

export default compose(
  connect(null, mapDispatchToProps),
  withSpeechMessages,
);
