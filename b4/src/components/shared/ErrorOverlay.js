import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { rem } from 'polished';

import Card from './Card';
import Text from './Text';


const StyledFullscreenBlocker = styled.div`
  text-align: center;
`;

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;

  max-width: ${rem(420)};
  padding: ${rem(54)};

  img {
    width: 3rem;
    margin: 0 auto;
  }
`;

const StyledHeading = styled(Text)`
  margin: ${rem(40)} 0;
`;

const StyledBody = styled(Text)`
  margin-bottom: ${rem(40)};
`;

export const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  max-width: ${rem(600)};
  margin: ${rem(40)};
`;


const ErrorOverlay = ({ title, body, children, dataSelector, icon }) => (
  <StyledWrapper>
    <StyledFullscreenBlocker>
      <StyledCard>
        {icon}
        <StyledHeading
          fontSize="big"
          fontFamily="fontMilliardMedium"
          data-selector={dataSelector}>
          {title}
        </StyledHeading>
        <StyledBody fontSize="small">
          {body}
        </StyledBody>
        {children}
      </StyledCard>
    </StyledFullscreenBlocker>
  </StyledWrapper>
);

ErrorOverlay.propTypes = {
  title: PropTypes.string.isRequired,
  dataSelector: PropTypes.string.isRequired,
  body: PropTypes.node.isRequired,
  children: PropTypes.node,
  icon: PropTypes.node
};

export default ErrorOverlay;
