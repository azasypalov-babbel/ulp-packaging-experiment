import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';

import withB3 from '../../providers/b3';
import { StyledLegacyTrainerLayout } from '../LegacyTrainerLayout';
import { isMicEnabled } from '../../dux/session/selectors';

import * as Engines from '../../services/speechRecognition/engines';

const mapStateToProps = ({ session }) => ({
  isMicEnabled: isMicEnabled(session)
});

export class LegacyTrainerSettingsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();

    this.mountLegacyTrainerPage = this.mountLegacyTrainerPage.bind(this);
  }

  componentDidMount() {
    this.mountLegacyTrainerPage();
  }

  mountLegacyTrainerPage() {
    const { b3, onFinish, speechEngineName, isMicEnabled } = this.props;

    const options = {
      speechEngineName,
      mountPoint: this.containerRef.current,
      defaultValue: isMicEnabled
    };

    b3.pageTrainerSettings(onFinish, options);
  }

  render() {
    return (
      <StyledLegacyTrainerLayout
        ref={this.containerRef}
        className="b3"
      />
    );
  }
}

LegacyTrainerSettingsContainer.propTypes = {
  onFinish: PropTypes.func.isRequired,
  b3: PropTypes.any.isRequired,
  isMicEnabled: PropTypes.bool.isRequired,
  speechEngineName: PropTypes.oneOf([
    Engines.types.LEGACY_SPEECH,
    Engines.types.WEB_SPEECH,
    Engines.types.NATIVE_SPEECH
  ])
};

LegacyTrainerSettingsContainer.displayName = 'LegacyTrainerSettingsContainer';

export default compose(
  connect(mapStateToProps, null),
  withB3
)(LegacyTrainerSettingsContainer);
