import React from 'react';
import PropTypes from 'prop-types';
import styled, { css, keyframes } from 'styled-components';
import InfoText from './InfoText';
import { isWebview } from '../../../lib/features';
import Card from '../Card';
import CrossIcon from '../icons/CrossIcon';

const containerWidth = '20rem';

const slideInKeyframes = keyframes`
  from {
    transform: translateX(100px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const fadeInKeyframes = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const StyledCard = styled(Card)`
  animation: ${fadeInKeyframes};

  display: flex;
  flex-direction: column;

  ${isWebview() && css`
    height: calc(
      100vh 
      - ${(props) => props.theme.size.navbar.xsmall.height} 
      - env(safe-area-inset-top)
    );
  `}

  @media (min-width: ${(props) => props.theme.viewports.breakpoints.xsmall}) {
    float: right;
    
    max-width: ${containerWidth};
    min-width: ${containerWidth};

    margin-top: 0.75rem;
    margin-right: 0.75rem;

    overflow-y: auto;

    max-height: calc(100vh - 1.5rem);

    animation: ${slideInKeyframes} 0.3s;
  }

  z-index: 1;
`;

const StyledList = styled.ul`
  padding: 0 1rem 1rem;
  margin: 0;
  list-style: none;

  overflow-y: auto;
  max-height: 100%;

  @media (min-width: ${(props) => props.theme.viewports.breakpoints.xsmall}) {
    overflow-y: visible;
    max-height: none;
  }

  & > li:last-child {
    padding-bottom: env(safe-area-inset-bottom);
  }

  * + * {
    margin-top: 0.5rem;
  }
`;

const StyledCloseLink = styled.a`
  display: inline-flex;
  align-self: flex-end;

  margin: 0;
  padding: 0.5rem 1rem;

  color: ${(props) => props.theme.cascada.spaceGrayW15};
  cursor: pointer;
  opacity: 0.5;

  &:hover {
    opacity: 1;
  }
`;

export const InfoTextList = ({ infoTexts, hide }) => {
  const renderListItem = (text) => (
    <li key={text}>
      <InfoText infoText={text} />
    </li>
  );

  return (
    <StyledCard>
      <StyledCloseLink data-selector="close-x-button" onClick={hide}>
        <CrossIcon fillColor={'currentColor'} />
      </StyledCloseLink>
      <StyledList data-selector="info-texts-sidebox" data-length={infoTexts.length}>
        {infoTexts.map(renderListItem)}
      </StyledList>
    </StyledCard>
  );
};

InfoTextList.propTypes = {
  infoTexts: PropTypes.array.isRequired,
  hide: PropTypes.func.isRequired
};

export default InfoTextList;
