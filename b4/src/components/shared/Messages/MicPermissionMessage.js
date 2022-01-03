import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { VideocamBlocked } from '../icons';
import { ReplaceInline } from '../ReplaceInline';
import ErrorOverlay from '../ErrorOverlay';
import Button from '../Button/Button';
import { MicOff } from '../icons';
import { setMicSettings } from '../../../dux/session/actions';
import { isReview } from '../../../dux/session/selectors';
import { track } from '../../../dux/tracker/actions';
import { MESSAGE_KEYS } from '../../../dux/messages/messageKeys';
import { removeMessage } from '../../../dux/messages/actions';
import withTranslations from '../withTranslations';

export class MicPermissionMessage extends React.Component {
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
        gui_container: 'mic_error_no_permission',
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

    removeMessage(MESSAGE_KEYS.MIC_PERMISSIONS);
    setMicSettings(false);

    /* eslint-disable camelcase */
    track({
      event: 'gui:interacted',
      version: 1,
      payload: {
        gui_container: 'mic_error_no_permission',
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
    const replacedBody = (<ReplaceInline
      symbol="[*]"
      replacement={<VideocamBlocked size="1.25rem" />}>
      {body}
    </ReplaceInline>);

    return (
      <ErrorOverlay
        key="permission-error"
        dataSelector="error-overlay-mic-permission-error"
        title={title}
        body={replacedBody}
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
      </ErrorOverlay>
    );
  }
}

MicPermissionMessage.propTypes = {
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
  title: translate('speech_recognition.error_mic_permission.title'),
  body: translate('speech_recognition.error_mic_permission.body'),
  cta: translate('speech_recognition.error_mic_permission.cta')
});

export default compose(
  withTranslations(getTranslations),
  connect(mapStateToProps, mapDispatchToProps),
)(MicPermissionMessage);
