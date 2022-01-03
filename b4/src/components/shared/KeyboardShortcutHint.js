import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Text from './Text';

const keyNameIconMapping = {
  Enter: '↵',
  Space: '␣'
};

const getKeyIcon = (key) => keyNameIconMapping[key] || key;

const StyledKeyboardShortcutHints = styled.span`
  box-sizing: border-box;
  height: 1.5rem;
  width: 1.5rem;

  display: inline-flex;
  justify-content: center;
  align-items: center;

  background-color: ${(props) => props.theme.cascada.iceGrayW50};

  color: ${(props) => props.theme.cascada.storm};

  border-radius: 0.25rem;
  border: 1px solid ${(props) => props.theme.cascada.pastelStorm};

  user-select: none;
`;

const KeyboardShortcutHint = (props) =>
  <StyledKeyboardShortcutHints data-selector="keyboard-shortcut-hint" {...props}>
    <Text fontFamily="fontMilliardBook">{getKeyIcon(props.keyName)}</Text>
  </StyledKeyboardShortcutHints>
;

KeyboardShortcutHint.propTypes = {
  keyName: PropTypes.string.isRequired
};

export default KeyboardShortcutHint;
