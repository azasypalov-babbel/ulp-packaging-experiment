import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getDisplayName } from '../getDisplayName';
import { requestMicPermissions } from '../../dux/permissions/actions';
import { withServices } from './withServices';
import rollbar from '../../services/rollbarService';
import { PERMISSIONS_STATUS } from '../../dux/permissions/status';

import * as Engines from '../../services/speechRecognition/engines';

export const SPEECHRECOGNITION_ERRORS = {
  NO_SPEECH: 'no-speech',
  ABORTED: 'aborted',
  AUDIO_CAPTURE: 'audio-capture',
  NETWORK: 'network',
  NOT_ALLOWED: 'not-allowed',
  SERVICE_NOT_ALLOWED: 'service-not-allowed',
  BAD_GRAMMAR: 'bad-grammar',
  LANGUAGE_NOT_SUPPORTED: 'language-not-supported'
};

export const CUSTOM_ERRORS = {
  UNKNOWN_ERROR: 'unknown-error',
  MIC_MUTED: 'mic-muted'
};

export const MEDIADEVICES_ERRORS = {
  NOT_ALLOWED: 'NotAllowedError'
};

const initialState = {
  confidenceScore: null,
  ended: false,
  error: '',
  listening: false,
  recording: false,
  solved: false,
  transcript: '',
  targetText: ''
};

const speechWordTimeout = 1000;

export const transcriptHasChanged = (prevSpeech, speech) =>
  speech.transcript !== prevSpeech.transcript &&
  speech.transcript !== initialState.transcript;

export const recognitionHasEnded = (prevSpeech, speech) =>
  prevSpeech.ended === false &&
  speech.ended === true;

export const recognitionHasError = (prevSpeech, speech) =>
  speech.error !== prevSpeech.error &&
  speech.error !== initialState.error;

/**
 * @deprecated in favour of `useSpeech`.
 */
export const withSpeech = (WrappedComponent) => {
  class WithSpeech extends React.Component {
    constructor(props) {
      super(props);

      this.state = initialState;

      this.handleStart = this.handleStart.bind(this);
      this.handleSpeechStart = this.handleSpeechStart.bind(this);
      this.handleEnd = this.handleEnd.bind(this);
      this.handleError = this.handleError.bind(this);
      this.handleResult = this.handleResult.bind(this);
      this.handleMutedChange = this.handleMutedChange.bind(this);

      this.start = this.start.bind(this);
      this.stop = this.stop.bind(this);
      this.reset = this.reset.bind(this);

      this.engineName = props.speechRecognitionService.getEngineName();
      this.advanceAutoSpeechStopTimeout = this.advanceAutoSpeechStopTimeout.bind(this);

      this.speechTimeout = null;
    }

    handleStart() {
      this.setState({
        confidenceScore: null,
        ended: false,
        error: '',
        recording: false,
        transcript: '',
        listening: true
      });
    }

    handleSpeechStart() {
      this.setState({ listening: false, recording: true });
    }

    handleEnd() {
      this.setState({ listening: false, recording: false, ended: true });
    }

    handleError({ error }) {
      this.setState({ error });
      const ignoreMessages = [
        SPEECHRECOGNITION_ERRORS.NO_SPEECH,
        SPEECHRECOGNITION_ERRORS.ABORTED
      ];
      if (error && !ignoreMessages.includes(error)) {
        rollbar.debug(`withSpeech SpeechRecognition Error: ${error}`);
      }
    }

    advanceAutoSpeechStopTimeout() {
      clearTimeout(this.speechTimeout);
      this.speechTimeout = setTimeout(this.stop, speechWordTimeout);
    }

    handleResult({
      transcript,
      isFinal,
      confidenceScore,
      solved
    }) {
      if (this.engineName === Engines.types.WEB_SPEECH && transcript) {
        this.advanceAutoSpeechStopTimeout();
      }

      this.setState({
        transcript,
        ended: isFinal,
        confidenceScore,
        solved
      });
    }

    handleMutedChange({ target }) {
      if (target.muted) {
        this.handleError({ error: CUSTOM_ERRORS.MIC_MUTED });
        this.stop();
      } else {
        this.handleError({ error: initialState.error });
      }
    }

    componentWillUnmount() {
      this.props.speechRecognitionService.cleanup();
      clearTimeout(this.speechTimeout);
    }

    componentDidMount() {
      this.props.requestMicPermissions();
    }

    start(options = {}) {
      this.setState({
        targetText: options.targetText
      });

      this.props.speechRecognitionService.start({
        onStart: this.handleStart,
        onSpeechStart: this.handleSpeechStart,
        onEnd: this.handleEnd,
        onError: this.handleError,
        onResult: this.handleResult,
        onMuteChange: this.handleMutedChange,
        locale: this.props.locale,
        learnLanguageAlpha3: this.props.learnLanguageAlpha3,
        ...options
      });
    }

    stop() {
      this.props.speechRecognitionService.stop();
    }

    reset() {
      this.setState({ ...initialState });
    }

    render() {
      const {
        confidenceScore,
        ended,
        error,
        listening,
        recording,
        solved,
        transcript
      } = this.state;

      const {
        permissionsGranted,
        ...restProps
      } = this.props;

      const speech = {
        permissionsGranted,
        confidenceScore,
        ended,
        error,
        listening,
        recording,
        solved,
        transcript,
        engineName: this.engineName,
        start: this.start,
        stop: this.stop,
        reset: this.reset
      };

      return (
        <WrappedComponent {...restProps} speech={speech} />
      );
    }
  }

  WithSpeech.displayName = `WithSpeech(${getDisplayName(WrappedComponent)})`;

  WithSpeech.propTypes = {
    locale: PropTypes.string.isRequired,
    learnLanguageAlpha3: PropTypes.string.isRequired,
    requestMicPermissions: PropTypes.func.isRequired,
    permissionsGranted: PropTypes.bool.isRequired,
    speechRecognitionService: PropTypes.any.isRequired
  };

  return WithSpeech;
};

const mapDispatchToProps = {
  requestMicPermissions
};

const mapStateToProps = ({ permissions, session }) => ({
  permissionsGranted: permissions.micPermission === PERMISSIONS_STATUS.granted,
  learnLanguageAlpha3: session.learnLanguageAlpha3,
  locale: session.locale
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withServices(['speechRecognitionService']),
  withSpeech
);

const speechEngineName = PropTypes.oneOf([
  Engines.types.WEB_SPEECH,
  Engines.types.NATIVE_SPEECH
]);

export const speechPropTypes = PropTypes.shape({
  permissionsGranted: PropTypes.bool.isRequired,
  ended: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  listening: PropTypes.bool.isRequired,
  recording: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired,
  start: PropTypes.func.isRequired,
  transcript: PropTypes.string.isRequired,
  solved: PropTypes.bool,
  engineName: speechEngineName
});
