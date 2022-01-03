import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ErrorOverlay from '../ErrorOverlay';
import Button from '../Button/Button';
import { MicOff } from '../icons';
import { setMicSettings } from '../../../dux/session/actions';
import { isReview } from '../../../dux/session/selectors';
import { track } from '../../../dux/tracker/actions';
import { MESSAGE_KEYS } from '../../../dux/messages/messageKeys';
import { removeMessage } from '../../../dux/messages/actions';
import withTranslations from '../withTranslations';

export class MicMutedMessage extends React.Component {
  constructor(props) {
    super(props);

    this.handleCtaButtonClick = this.handleCtaButtonClick.bind(this);
  }

  componentDidMount() {
    const { track, locale, learnLanguageAlpha3 } = this.props;

    /* eslint-disable camelcase */
    track({
      event: 'gui:shown',
      version: 1,
      payload: {
        gui_container: 'mic_error_muted',
        gui_element: 'opt_out_button',
        origin: 'lesson_player',
        locale: locale,
        learn_language_alpha3: learnLanguageAlpha3
      }
    });
    /* eslint-enable camelcase */
  }

  handleCtaButtonClick() {
    const { track, locale, learnLanguageAlpha3, removeMessage, setMicSettings } = this.props;

    removeMessage(MESSAGE_KEYS.MIC_MUTED);
    setMicSettings(false);

    /* eslint-disable camelcase */
    track({
      event: 'gui:interacted',
      version: 1,
      payload: {
        gui_container: 'mic_error_muted',
        gui_element: 'opt_out_button',
        interaction: 'clicked',
        origin: 'lesson_player',
        locale: locale,
        learn_language_alpha3: learnLanguageAlpha3
      }
    });
    /* eslint-enable camelcase */
  }

  render() {
    const { translations, isReview } =  this.props;
    const { title, body, cta } = translations;

    return <ErrorOverlay
      key="speech-error"
      dataSelector="error-overlay-speech-error"
      title={title}
      body={body}
      icon={<MicOff size={'3.5rem'} />}
    >
      {!isReview &&
        <Button
          data-selector="cta-button"
          onClick={this.handleCtaButtonClick}
        >
          {cta}
        </Button>
      }
    </ErrorOverlay>;
  }
}

MicMutedMessage.propTypes = {
  isReview: PropTypes.bool.isRequired,
  setMicSettings: PropTypes.func.isRequired,
  removeMessage: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  learnLanguageAlpha3: PropTypes.string.isRequired,
  track: PropTypes.func.isRequired,
  translations: PropTypes.shape({
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    cta: PropTypes.string.isRequired
  })
};

const mapDispatchToProps = {
  setMicSettings,
  removeMessage,
  track
};

const mapStateToProps = ({ session }) => ({
  isReview: isReview(session),
  learnLanguageAlpha3: session.learnLanguageAlpha3,
  locale: session.locale
});

const getTranslations = (translate) => ({
  title: translate('speech_recognition.error_mic_muted.title'),
  body: translate('speech_recognition.error_mic_muted.body'),
  cta: translate('speech_recognition.error_mic_muted.cta')
});

export default compose(
  withTranslations(getTranslations),
  connect(mapStateToProps, mapDispatchToProps),
)(MicMutedMessage);
