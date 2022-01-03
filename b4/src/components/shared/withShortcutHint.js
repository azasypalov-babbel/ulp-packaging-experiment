import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { getDisplayName } from '../getDisplayName';
import KeyboardShortcutHint from './KeyboardShortcutHint';

const withShortcutHint = (WrappedComponent) => {
  const WithShortcutHint = ({ shortcutsVisible, ...props }) => {
    const { listenToKey } = props;
    return (
      <WrappedComponent
        {...props}
        keyboardHintComponent={shortcutsVisible ? <KeyboardShortcutHint keyName={listenToKey} /> : null}
      />);
  };
  WithShortcutHint.displayName = `WithShortcutHint(${getDisplayName(WrappedComponent)})`;

  WithShortcutHint.propTypes = {
    listenToKey: PropTypes.string,
    shortcutsVisible: PropTypes.bool.isRequired
  };
  return WithShortcutHint;
};

const mapStateToProps = ({ keyboard }, props) => ({
  shortcutsVisible: typeof props.shortcutsVisible === 'undefined' // Allow global toggle override from props
    ? keyboard.showHints
    : props.shortcutsVisible
});

export default compose(
  connect(mapStateToProps),
  withShortcutHint
);
