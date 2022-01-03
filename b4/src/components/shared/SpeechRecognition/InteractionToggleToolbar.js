import React, { Component } from 'react';
import { compose } from '../../../lib/compose';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as sessionActions from '../../../dux/session/actions';
import { isMicEnabled } from '../../../dux/session/selectors';
import Toolbar from '../../shared/Toolbar';
import InteractionToggle from '../../shared/SpeechRecognition/InteractionToggle';

const mapStateToProps = ({ session, sequence }) => ({
  isMicEnabled: isMicEnabled(session),
  interaction: sequence.trainers[sequence.currentTrainerIndex].interaction
});

const mapDispatchToProps = {
  setMicSettings: sessionActions.setMicSettings
};

export class InteractionToggleToolbar extends Component {
  constructor(props) {
    super(props);

    this.handleInteractionToggleClick = this.handleInteractionToggleClick.bind(this);
  }

  handleInteractionToggleClick() {
    this.props.setMicSettings(!this.props.isMicEnabled);
  }

  render() {
    return (
      <Toolbar>
        <InteractionToggle
          onClick={this.handleInteractionToggleClick}
        />
      </Toolbar>
    );
  }
}

InteractionToggleToolbar.propTypes = {
  isMicEnabled: PropTypes.bool.isRequired,
  setMicSettings: PropTypes.func.isRequired
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(InteractionToggleToolbar);
