import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { isReview } from '../../../dux/session/selectors';
import PropTypes from 'prop-types';
import ErrorOverlay from '../ErrorOverlay';
import Button from '../Button/Button';
import { MicOff } from '../icons';
import { track } from '../../../dux/tracker/actions';
import withTranslations from '../withTranslations';
import { withServices } from '../withServices';

export class MicGenericMessage extends React.Component {
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
        gui_container: 'mic_error_generic',
        gui_element: 'opt_out_button',
        origin: 'lesson_player',
        locale: locale,
        learn_language_alpha3: learnLanguageAlpha3
      }
    });
    /* eslint-enable camelcase */
  }

  handleCtaButtonClick() {
    const { track, locale, learnLanguageAlpha3, navigationService } = this.props;

    /* eslint-disable camelcase */
    track({
      event: 'gui:interacted',
      version: 1,
      payload: {
        gui_container: 'mic_error_generic',
        gui_element: 'opt_out_button',
        interaction: 'clicked',
        origin: 'lesson_player',
        locale: locale,
        learn_language_alpha3: learnLanguageAlpha3
      }
    });
    /* eslint-enable camelcase */

    navigationService.reload();
  }

  render() {
    const { translations, isReview } =  this.props;
    const { title, body, cta } = isReview
      ? translations.errorGenericReview
      : translations.errorGenericLesson;

    return <ErrorOverlay
      key="generic-error"
      dataSelector="error-overlay-generic-error"
      title={title}
      body={body}
      icon={<MicOff size={'3.5rem'} />}
    >
      <Button
        data-selector="cta-button"
        negativeSolid
        onClick={this.handleCtaButtonClick}
      >
        {cta}
      </Button>
    </ErrorOverlay>;
  }
}

MicGenericMessage.propTypes = {
  navigationService: PropTypes.shape({
    reload: PropTypes.func.isRequired
  }).isRequired,
  translations: PropTypes.shape({
    errorGenericReview: PropTypes.shape({
      title: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired,
      cta: PropTypes.string.isRequired
    }).isRequired,
    errorGenericLesson: PropTypes.shape({
      title: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired,
      cta: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  isReview: PropTypes.bool.isRequired,
  locale: PropTypes.string.isRequired,
  learnLanguageAlpha3: PropTypes.string.isRequired,
  track: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  track
};

const mapStateToProps = ({ session }) => ({
  isReview: isReview(session),
  learnLanguageAlpha3: session.learnLanguageAlpha3,
  locale: session.locale
});

const getTranslations = (translate) => ({
  errorGenericReview: {
    title: translate('speech_recognition.error_generic_review.title'),
    body: translate('speech_recognition.error_generic_review.body'),
    cta: translate('speech_recognition.error_generic_review.cta')
  },
  errorGenericLesson: {
    title: translate('speech_recognition.error_generic_lesson.title'),
    body: translate('speech_recognition.error_generic_lesson.body'),
    cta: translate('speech_recognition.error_generic_lesson.cta')
  }
});

export default compose(
  withTranslations(getTranslations),
  connect(mapStateToProps, mapDispatchToProps),
  withServices(['navigationService'])
)(MicGenericMessage);
