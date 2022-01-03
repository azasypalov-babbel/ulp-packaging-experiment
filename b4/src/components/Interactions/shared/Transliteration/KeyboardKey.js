import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Text from '../../../shared/Text';

const StyledKeyboardKey = styled.span`
  background-color: ${(props) => props.theme.color.edge.raw.yellow.limon};
  border-color: ${(props) => props.theme.color.edge.raw.orange.berlin};
  border-style: solid;
  border-width: 0 0 1px 1px;
  border-radius: 8px;
  padding: 0.5em 0.5em;
  display: inline-block;
  text-align: center;
  box-sizing: border-box;
  min-width: 2em;
  margin: 0 0.25em;
  box-shadow: -3px 3px 0 ${(props) => props.theme.color.edge.raw.yellow.joyful};
`;

const SYMBOLS = {
  RETURN: '⏎'
};

const KeyboardKey = ({ character }) => (
  <StyledKeyboardKey>
    <Text color="spaceGray">
      {SYMBOLS[character] || character}
    </Text>
  </StyledKeyboardKey>
);

KeyboardKey.propTypes = {
  character: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf(Object.keys(SYMBOLS))
  ]).isRequired
};

export default KeyboardKey;
