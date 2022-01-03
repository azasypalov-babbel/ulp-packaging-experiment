import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import IconButton from '../IconButton/IconButton';

import { isMicEnabled } from '../../../dux/session/selectors';
import { track } from '../../../dux/tracker/actions';
import { compose } from 'redux';
import withTranslations from '../withTranslations';

const mapStateToProps = ({ session, sequence }) => ({
  isMicEnabled: isMicEnabled(session),
  learnLanguageAlpha3: session.learnLanguageAlpha3,
  locale: session.locale,
  type: sequence.trainers[sequence.currentTrainerIndex].type,
  interaction: sequence.trainers[sequence.currentTrainerIndex].interaction
});

const mapDispatchToProps = {
  track
};

export class InteractionToggle extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleToggleHover = this.handleToggleHover.bind(this);

    this.state = {
      hover: false
    };
  }

  handleClick() {
    const { track, locale, learnLanguageAlpha3, isMicEnabled, type, interaction } = this.props;
    const typeInteraction = `${type}${interaction.replace(interaction[0], interaction[0].toUpperCase())}`;

    this.props.onClick();

    /* eslint-disable camelcase */
    track({
      event: 'gui:interacted',
      version: 2,
      payload: {
        gui_container: typeInteraction,
        gui_element: 'mic_toggle',
        gui_variant: isMicEnabled ? 'without_mic' : 'with_mic',
        origin: 'lesson_player',
        locale: locale,
        learn_language_alpha3: learnLanguageAlpha3
      }
    });
    /* eslint-enable camelcase */
  }

  handleToggleHover() {
    this.setState({
      hover: !this.state.hover
    });
  }

  render() {
    const { translations } = this.props;
    return (
      <IconButton
        data-selector="mic-toggle"
        onMouseEnter={this.handleToggleHover}
        onMouseLeave={this.handleToggleHover}
        iconName={this.props.isMicEnabled ? 'MicOff' : 'MicIcon'}
        onClick={this.handleClick}
        contentClassName={'hide-for-small'}
      >
        {this.props.isMicEnabled ? translations.toggleOff : translations.toggleOn}
      </IconButton>
    );
  }
}

InteractionToggle.propTypes = {
  onClick: PropTypes.func.isRequired,
  isMicEnabled: PropTypes.bool.isRequired,
  locale: PropTypes.string.isRequired,
  learnLanguageAlpha3: PropTypes.string.isRequired,
  track: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  interaction: PropTypes.string.isRequired,
  translations: PropTypes.shape({
    toggleOff: PropTypes.string.isRequired,
    toggleOn: PropTypes.string.isRequired
  })
};

const getTranslations = (translate) => ({
  toggleOn: translate('speech_recognition.interaction.toggle_on'),
  toggleOff: translate('speech_recognition.interaction.toggle_off')
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslations(getTranslations),
)(InteractionToggle);
