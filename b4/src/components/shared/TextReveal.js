import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Text from './Text';

const StyledTextReveal = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  background-color: ${(props) =>
    props.reveal
      ? props.theme.cascada.iceGray
      : props.theme.cascada.pastelElectric
};

  transition: background-color 0.5s;

  max-width: 20rem;

  border-radius: 0.25rem;

  padding: 1rem;
`;

const TextReveal = ({ reveal, children }) =>(
  <StyledTextReveal reveal={reveal}>
    <Text
      fontFamily="fontMilliardMedium"
      color="spaceGray"
      fontSize={reveal ? 'medium' : 'large'}
      textAlign="center">
      {reveal ? children : '?'}
    </Text>
  </StyledTextReveal>
);

TextReveal.propTypes = {
  reveal: PropTypes.bool,
  children: PropTypes.node
};

export default TextReveal;
