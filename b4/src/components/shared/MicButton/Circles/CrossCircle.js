import React from 'react';
import styled from 'styled-components';

import CrossIcon from '../../icons/CrossIcon';
import commonCircleStyles from './commonCircleStyles';

const StyledCircle = styled.div`
  ${commonCircleStyles};
  background: ${(props) => props.theme.cascada.red};
`;

const CrossCircle = () => (
  <StyledCircle>
    <CrossIcon size="2.5rem" />
  </StyledCircle>
);

export default CrossCircle;
