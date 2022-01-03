import React from 'react';
import styled from 'styled-components';

import CheckIcon from '../../icons/CheckIcon';
import commonCircleStyles from './commonCircleStyles';

const StyledCircle = styled.div`
  ${commonCircleStyles};
  background: ${(props) => props.theme.cascada.teal};
`;

const CheckCircle = () => (
  <StyledCircle>
    <CheckIcon size="2.5rem" />
  </StyledCircle>
);

export default CheckCircle;
