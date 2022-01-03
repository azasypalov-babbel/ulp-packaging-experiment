import React from 'react';
import styled from 'styled-components';
import { transparentize } from 'polished';
import Text from './Text';

const StyledPlaceholder = styled.div`
  box-sizing: border-box;
  min-width: ${(props) => props.width};
  min-height: ${(props) => props.height};
  background-color: ${(props) => transparentize(0.2, props.theme.cascada.iceGray)};

  border-radius: 0.5rem;

  padding: 1rem;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Placeholder = (props) => (
  <StyledPlaceholder {...props}>
    <Text as="p" fontFamily="fontMilliardSemi" color="spaceGray" fontSize="small">Placeholder</Text>
  </StyledPlaceholder>
);

export default Placeholder;
