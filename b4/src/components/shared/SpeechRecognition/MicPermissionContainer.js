import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import withSpeech from '../../shared/withSpeech';
import withSpeechMessages from '../../shared/withSpeechMessages';

import { track } from '../../../dux/tracker/actions';
import { requestMicPermissions, setPermissionCompleted } from '../../../dux/permissions/actions';
import { PERMISSIONS_STATUS } from '../../../dux/permissions/status';
import { isReview } from '../../../dux/session/selectors';

import MicPermission from './MicPermission';

export class MicPermissionContainer extends React.Component {
  constructor(props) {
    super(props);

    this.onMicPermissionComplete = this.onMicPermissionComplete.bind(this);
  }

  componentDidMount() {
    const {
      track,
      requestMicPermissions,
      learnLanguageAlpha3,
      locale
    } = this.props;

    requestMicPermissions();

    /* eslint-disable camelcase */
    track({
      event: 'gui:shown',
      version: 1,
      payload: {
        gui_container: 'mic_permission_screen',
        gui_element: 'continue_button',
        origin: 'lesson_player',
        locale: locale,
        learn_language_alpha3: learnLanguageAlpha3
      }
    });
    /* eslint-enable camelcase */
  }

  onMicPermissionComplete() {
    const { track, locale, learnLanguageAlpha3 } = this.props;

    this.props.setPermissionCompleted(true);

    /* eslint-disable camelcase */
    track({
      event: 'gui:interacted',
      version: 1,
      payload: {
        gui_container: 'mic_permission_screen',
        gui_element: 'continue_button',
        interaction: 'clicked',
        origin: 'lesson_player',
        locale: locale,
        learn_language_alpha3: learnLanguageAlpha3
      }
    });
    /* eslint-enable camelcase */
  }

  render() {
    const continueEnabled = this.props.isMicPermissionGranted;
    const dataSelector = `mic-onboarding-with-mic-${continueEnabled ? 'enabled' : 'disabled'}`;

    return <MicPermission
      isReview={this.props.isReview}
      onClick={this.onMicPermissionComplete}
      continueEnabled={continueEnabled}
      dataSelector={dataSelector}
    />;
  }
}

MicPermissionContainer.propTypes = {
  isReview: PropTypes.bool.isRequired,
  learnLanguageAlpha3: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  track: PropTypes.func.isRequired,
  isMicPermissionGranted: PropTypes.bool.isRequired,
  setPermissionCompleted: PropTypes.func.isRequired,
  requestMicPermissions: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  track,
  requestMicPermissions,
  setPermissionCompleted
};

const mapStateToProps = ({ session, permissions }) => ({
  isReview: isReview(session),
  learnLanguageAlpha3: session.learnLanguageAlpha3,
  locale: session.locale,
  isMicPermissionGranted: permissions.micPermission === PERMISSIONS_STATUS.granted
});

export default compose(
  withSpeech,
  withSpeechMessages,
  connect(mapStateToProps, mapDispatchToProps)
)(MicPermissionContainer);
