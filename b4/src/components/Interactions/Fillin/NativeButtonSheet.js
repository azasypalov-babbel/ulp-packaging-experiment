import React from 'react';
import PropTypes from 'prop-types';
import { useEffect, useContext } from 'react';
import { connect } from 'react-redux';

import { track } from '../../../dux/tracker/actions';
import { ServiceContext } from '../../shared/withServices';
import { BRIDGE_EVENTS } from '../../../services/nativeHintButton';
import { HINT_LEVEL } from './useInputHint';
import { renderInBottomLayout } from '../../shared/BottomLayout';
import { compose } from 'redux';

const NativeHintButton = ({ onClick, nextHintLevel }) => {
  const { nativeHintButton } = useContext(ServiceContext);

  useEffect(() => {
    nativeHintButton.addEventListener(BRIDGE_EVENTS.ON_CLICK, onClick);
    return () => {
      nativeHintButton.removeEventListener(BRIDGE_EVENTS.ON_CLICK, onClick);
    };
  }, [nativeHintButton, onClick]);

  useEffect(() => {
    nativeHintButton.show(nextHintLevel);
    return () => {
      nativeHintButton.hide();
    };
  }, [nextHintLevel, nativeHintButton]);

  // Reserve some height in the DOM to represent the button
  // The actual UI is rendered natively so this height may
  // Need to be adjusted if the native UI changes
  return <div style={{ height: '5em' }}/>;
};

NativeHintButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  nextHintLevel: PropTypes.oneOf(Object.values(HINT_LEVEL))
};


const trackGuiInteractedEvent = (track, guiElement) => {
  /* eslint-disable camelcase */
  track({
    event: 'gui:interacted',
    version: 1,
    payload: {
      gui_container: 'native_hint_button',
      gui_element: guiElement,
      interaction: 'clicked',
      origin: 'lesson_player'
    }
  });
  /* eslint-enable camelcase */
};

const trackButtonClicked = (track, hintLevel) => {
  if (hintLevel === 'HINT') {
    trackGuiInteractedEvent(track, 'see_hint_button');
  } else if (hintLevel === 'SOLUTION') {
    trackGuiInteractedEvent(track, 'see_solution_button');
  }
};

const NativeButtonSheet = ({ onHint, nextHintLevel, track }) => {
  if (nextHintLevel === HINT_LEVEL.NONE) return null;

  return (<NativeHintButton
    onClick={() => {
      trackButtonClicked(track, nextHintLevel);
      onHint();
    }}
    nextHintLevel={nextHintLevel}
  />);
};

const mapDispatchToProps = {
  track
};

NativeButtonSheet.propTypes = {
  onHint: PropTypes.func.isRequired,
  nextHintLevel: PropTypes.string.isRequired,
  track: PropTypes.func.isRequired
};

export default compose(
  connect(null, mapDispatchToProps),
  renderInBottomLayout
)(NativeButtonSheet);
